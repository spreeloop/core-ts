import * as axios from "axios";
import { AxiosError } from "axios";
import base64url from "base64url";
import * as https from "https";
import { LoggerInterface } from "./logging_interface";

export enum RequestStatusCode {
  unauthorized = 401,
  expectationFailed = 417,
}

export type RequestResponse<T> = {
  response?: {
    data: T;
    status: number;
  };
  error?: unknown;
};

/**
 * Posts an http request to the given route.
 * @param {Record<string, string | undefined> | string} data The data to be posted.
 * @param {string} route The end point url.
 * @param {Record<string, string>} headers The type content  of request.
 * @param {LoggerInterface} logger The logger to use when posting data.
 * @return {Promise<unknown | undefined>} The server response.
 */
export async function postRequest<T>({
  data,
  route,
  headers,
  logger,
  rejectUnauthorized = true,
}: {
  data?: Record<string, unknown> | string | null;
  route: string;
  logger: LoggerInterface;
  headers?: Record<string, string>;
  rejectUnauthorized?: boolean;
}): Promise<RequestResponse<T>> {
  try {
    logger.info(
      `Request on the route ${route} is running with data : ${JSON.stringify({
        headers,
        data,
        route,
      })}`
    );
    const agent = new https.Agent({
      rejectUnauthorized: rejectUnauthorized,
    });
    const response = await axios.default({
      method: "post",
      url: route,
      headers: headers,
      data: data,
      httpsAgent: agent,
    });
    logger.info(
      `Request on the route ${route} completed successfully with data : ${JSON.stringify(
        {
          response: response.data,
          status: response.status,
          statusText: response.statusText,
        }
      )}`
    );
    return { response: { data: response.data, status: response.status } };
  } catch (error) {
    logger.warn(
      `[Axios] failed to post request on the route: ${route} with data : ${JSON.stringify(
        { headers, data, route }
      )}`
    );
    const parsedError = parseAxiosError(error);
    logger.warn(JSON.stringify(error));
    if (error instanceof AxiosError) {
      if (error.response) {
        return {
          response: {
            status: error.response.status,
            data: error.response.data,
          },
          error: parsedError,
        };
      }
    }

    return { error: parsedError };
  }
}

/**
 * Gets an http request to the given route.
 * @param {Record<string, string | undefined> | string} data The data to be posted.
 * @param {string} route The end point url.
 * @param {Record<string, string>} headers The type content  of request.
 * @param {LoggerInterface} logger The logger to use when getting data.
 * @return {Promise<unknown | undefined>} The server response.
 */
export async function getRequest<T>({
  data,
  route,
  headers,
  logger,
  rejectUnauthorized = true,
}: {
  data?: Record<string, string | undefined> | string;
  route: string;
  headers?: Record<string, string>;
  logger: LoggerInterface;
  rejectUnauthorized?: boolean;
}): Promise<RequestResponse<T>> {
  try {
    logger.info(
      `Request on the route ${route} is running with data : ${JSON.stringify({
        headers,
        data,
        route,
      })}`
    );
    const agent = new https.Agent({
      rejectUnauthorized: rejectUnauthorized,
    });
    const response = await axios.default({
      method: "get",
      url: route,
      headers: headers,
      data: data,
      httpsAgent: agent,
    });
    logger.info(
      `Request on the route ${route} completed successfully with data : ${JSON.stringify(
        {
          response: response.data,
          status: response.status,
          statusText: response.statusText,
        }
      )}`
    );
    return { response: { data: response.data, status: response.status } };
  } catch (error) {
    logger.warn(
      `[Axios] failed to get request on the route: ${route} with data : ${JSON.stringify(
        { headers, data, route }
      )}`
    );
    const parsedError = parseAxiosError(error);
    logger.warn(JSON.stringify(error));
    if (error instanceof AxiosError) {
      if (error.response) {
        return {
          response: {
            status: error.response.status,
            data: error.response.data,
          },
          error: parsedError,
        };
      }
    }

    return { error: parsedError };
  }
}

/**
 * Parses an Axios error and returns a modified error object.
 *
 * @param {unknown} error - The error object to be parsed.
 * @return {unknown} The modified error object.
 */
export function parseAxiosError(error: unknown): unknown {
  let err = error;
  if (error instanceof AxiosError) {
    if (error.response) {
      err = {
        responseError: {
          data: error.response.data,
          status: error.response.status,
          statusText: error.response.statusText,
          headers: error.response.headers,
        },
        requestBody: error.request.body,
      };
    } else if (error.request) {
      err = {
        requestFailed: {
          headers: error.config?.headers,
          data: error.config?.data,
        },
      };
    } else {
      err = {
        configFailed: error.message,
      };
    }
  }
  return err;
}

/**
 * Generates a hash using the given key and secret.
 *
 * @param {string} key - The key to be hashed.
 * @param {string} secret - The secret to be hashed.
 * @return {string} - The generated hash.
 */
export function hash(key: string, secret: string): string {
  const toHash = `${key}:${secret}`;
  if (!global.btoa) {
    return Buffer.from(toHash).toString("base64");
  }
  return global.btoa(toHash);
}

/**
 * Encode the body of the request.
 * @param {Record<string, string>} bodyRequest the body request.
 * @return {string} the encoded body request result.
 */
export function encodeTheBodyOfRequest(
  bodyRequest: Record<string, string>
): string {
  const formBody = [];
  for (const key in bodyRequest) {
    if ({}.hasOwnProperty.call(bodyRequest, key)) {
      const encodedKey = encodeURIComponent(key);
      const encodedValue = encodeURIComponent(bodyRequest[key]);
      formBody.push(encodedKey + "=" + encodedValue);
    }
  }
  return formBody.join("&");
}

// Encode to base64
export const encodeToBase64 = (
  apiUsername: string,
  apiPassword: string
): string => {
  return base64url(`${apiUsername}:${apiPassword}`);
};

/**
 * Encode the data to w3 x form encoded url.
 * @param {Record<string, string>} data the data to encode.
 * @return {string} the encoded value.
 */
export function encodeDataToXFormUrl(data: Record<string, string>): string {
  const segments: string[] = [];
  for (const key in data) {
    if (Object.hasOwnProperty.call(data, key)) {
      const encodedKey = encodeURIComponent(key);
      const encodedValue = encodeURIComponent(data[key]);
      segments.push(`${encodedKey}=${encodedValue}`);
    }
  }
  return segments.join("&");
}

/**
 * Checks if the code is a successful code response.
 * @param {num} code .
 * @return {boolean} true if the code is valid.
 */
export const isSuccessfulCodeResponse = (code: number): boolean =>
  code >= 200 && code < 300;
