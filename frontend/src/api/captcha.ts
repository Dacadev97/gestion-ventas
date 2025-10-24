import { http } from "./http";
import type { Captcha } from "../types";

export const fetchCaptcha = async (): Promise<Captcha> => {
  const { data } = await http.get<Captcha>("/captcha");
  return data;
};
