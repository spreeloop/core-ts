export enum XTargetEnvironmentType {
  mtnSandBox = "sandbox",
  mtnUganda = "mtnuganda",
  mtnGhana = "mtnghana",
  mtnIvoryCoast = "mtnivorycoast",
  mtnZambia = "mtnzambia",
  mtnCameroon = "mtncameroon",
  mtnBenin = "mtnbenin",
  mtnCongo = "mtncongo",
  mtnSwaziland = "mtnswaziland",
  mtnGuineaConakry = "mtnguineaconakry",
  mtnSouthAfrica = "mtnsouthafrica",
  mtnLiberia = "mtnliberia",
}

export enum Currency {
  /**
   * The EUR currency.
   */
  eur = "EUR",

  /**
   * The XAF currency.
   */
  xaf = "XAF",

  /**
   * The XOF currency.
   */
  xof = "XOF",

  /**
   * The Ghanaian cedi
   */
  ghs = "GHS",

  /**
   * The Guinean franc
   */
  gnf = "GNF",

  /**
   * The Liberian dollar
   */
  lrd = "LRD",

  /**
   * The South African rand
   */
  zar = "ZAR",

  /**
   * The Ugandan shilling
   */
  ugx = "UGX",

  /**
   * The Swazi lilangeni
   */
  szl = "SZL",

  /**
   * The Zambian kwacha
   */
  zmw = "ZMW",
}

/**
 * A mapping between x-target-environment and their currency.
 * As said by the doc: we should "Use Currency Code specific to the Country".
 */
export const XTargetEnvironmentCurrency: Record<
  XTargetEnvironmentType,
  Currency
> = {
  [XTargetEnvironmentType.mtnCameroon]: Currency.xaf,
  [XTargetEnvironmentType.mtnCongo]: Currency.xaf,
  [XTargetEnvironmentType.mtnBenin]: Currency.xof,
  [XTargetEnvironmentType.mtnGhana]: Currency.ghs,
  [XTargetEnvironmentType.mtnGuineaConakry]: Currency.gnf,
  [XTargetEnvironmentType.mtnIvoryCoast]: Currency.xof,
  [XTargetEnvironmentType.mtnLiberia]: Currency.lrd,
  [XTargetEnvironmentType.mtnSouthAfrica]: Currency.zar,
  [XTargetEnvironmentType.mtnSwaziland]: Currency.szl,
  [XTargetEnvironmentType.mtnUganda]: Currency.ugx,
  [XTargetEnvironmentType.mtnZambia]: Currency.zmw,
  [XTargetEnvironmentType.mtnSandBox]: Currency.eur,
};

/**
 * Contains request fields.
 */
export class ConstantRequestField {
  //  The content type field.
  public static readonly typeJson = "application/json";

  // The basic authorization field.
  public static readonly basic = "Basic";

  // The bearer field.
  public static readonly bearer = "Bearer";

  // The grant type field.
  public static readonly grantType = "grant_type";
}

export enum TargetEnvironment {
  sandbox = "dev",
  prod = "prod",
  fake = "fake",
}
