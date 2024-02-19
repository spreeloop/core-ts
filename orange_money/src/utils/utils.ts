import * as axios from 'axios';
import base64url from 'base64url';
import * as https from 'https';
import Joi from 'joi';
import { LoggerInterface } from './logging_interface';

// Encode to base64
export const encodeToBase64 = (
  apiUsername: string,
  apiPassword: string
): string => {
  return base64url(`${apiUsername}:${apiPassword}`);
};

export type RequestResponse<T> =
  | {
      data: T;
      status: number; // status of request.
      error?: undefined;
    }
  | {
      data?: undefined;
      status: number; // status of request.
      error: unknown;
    };

/**
 * Posts an http request to the given route.
 * @param {Record<string, string | undefined> | string} data The data to be posted.
 * @param {string} route The end point url.
 * @param {Record<string, string>} headers The type content  of request.
 * @return {Promise<unknown | undefined>} The server response.
 */
export async function postRequest<T, R = Record<string, unknown>>({
  data,
  route,
  headers,
  logger,
  bodySchema,
}: {
  data?: Record<string, unknown> | string;
  route: string;
  headers?: Record<string, string>;
  logger: LoggerInterface;
  bodySchema?: Joi.PartialSchemaMap<R>;
}): Promise<RequestResponse<T>> {
  try {
    const agent = new https.Agent({
      rejectUnauthorized: false,
    });
    let body: R | typeof data = data;
    if (bodySchema && data) {
      const validData = validateData<R>(data, bodySchema);

      if (!validData.isValidData) {
        return {
          error: validData.message,
          status: 400,
        };
      }
      body = validData.data;
    }

    const response = await axios.default({
      method: 'post',
      url: route,
      headers: headers,
      data: body,
      httpsAgent: agent,
    });
    logger.info(
      `Request on the route ${route} completed successfully with status ${
        response.status
      } and data : ${JSON.stringify(response.data)}`
    );
    return { data: response.data, status: response.status };
  } catch (err) {
    if (axios.default.isAxiosError(err)) {
      const error: axios.AxiosError = err;
      const response = error.response;
      if (response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        logger.warn(
          `The POST request was made on the router ${route} and the server responded with a status code ${
            response.status
          } with data response: ${JSON.stringify(response.data)}`
        );
        return {
          status: response.status,
          error: response.data,
        };
      }
      if (error.request) {
        // The request was made but no response was received
        // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
        // http.ClientRequest in node.js
        logger.warn(
          `The POST request was made on the router ${route} but no response was received. config data: ${error.config?.data}`
        );
        return { status: 0, error: error.config?.data };
      }

      logger.warn(
        `The POST request was made on the router ${route} but Something happened in setting up the request that triggered an Error. Error message: ${error.message}`
      );
      return { status: 404, error: error.message };
    }
    logger.warn(
      `[Axios] failed to send post request on the route: ${route}\n error: ${err}`
    );
    return { status: 404, error: err };
  }
}

/**
 * Gets an http request to the given route.
 * @param {Record<string, string | undefined> | string} data The data to be posted.
 * @param {string} route The end point url.
 * @param {Record<string, string>} headers The type content  of request.
 * @return {Promise<unknown | undefined>} The server response.
 */
export async function getRequest<T = Record<string, string | undefined>>({
  data,
  route,
  headers,
  logger,
}: {
  data?: Record<string, string | undefined> | string;
  route: string;
  headers?: Record<string, string>;
  logger: LoggerInterface;
}): Promise<RequestResponse<T>> {
  try {
    const agent = new https.Agent({
      rejectUnauthorized: false,
    });
    const response = await axios.default({
      method: 'get',
      url: route,
      headers: headers,
      data: data,
      httpsAgent: agent,
    });
    logger.info(
      `Request on the route ${route} completed successfully with status ${
        response.status
      } and data : ${JSON.stringify(response.data)}`
    );
    return { status: response.status, data: response.data };
  } catch (err) {
    if (axios.default.isAxiosError(err)) {
      const error: axios.AxiosError = err;
      const response = error.response;
      if (response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        logger.warn(
          `The GET request was made on the router ${route} and the server responded with a status code ${response.status} with data response: ${response.data}`
        );

        return {
          status: response.status,
          error: response.data,
        };
      }
      if (error.request) {
        // The request was made but no response was received
        // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
        // http.ClientRequest in node.js
        logger.warn(
          `The GET request was made on the router ${route} but no response was received. config data: ${error.config?.data}`
        );
        return { status: 0, error: error.config?.data };
      }

      logger.warn(
        `The GET request was made on the router ${route} but Something happened in setting up the request that triggered an Error. Error message: ${error.message}`
      );
      return { status: 404, error: error.message };
    }
    logger.warn(
      `[Axios] failed to send post request on the route: ${route}\n error: ${err}`
    );
    return { status: 404, error: err };
  }
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
      formBody.push(encodedKey + '=' + encodedValue);
    }
  }
  return formBody.join('&');
}

/**
 * Checks if the code is valid http successful response.
 * @param {num} code .
 * @return {boolean} true if the code is valid.
 */
export const isValidHttpSuccessfulStatus = (code: number): boolean =>
  code === 201 || code === 200 || code === 202;

/**
 * Checks if the data is valid type.
 * @param {Record<string, unknown>} data .
 * @param {Joi.PartialSchemaMap<T>} schema .
 * @return {Record<string, unknown>}
 */
export function validateData<T>(
  data: unknown,
  schema: Joi.PartialSchemaMap<T>
): { isValidData: true; data: T } | { isValidData: false; message: string } {
  const { error, value } = Joi.object<T>(schema).validate(data, {
    abortEarly: false,
    convert: false,
  });
  if (error) {
    return {
      isValidData: false,
      message: JSON.stringify(
        error.details.map((e) => e.message),
        null,
        ' '
      ),
    };
  }
  return {
    isValidData: true,
    data: value,
  };
}
