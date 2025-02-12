import { z } from "zod";

export const FormDataShema = z.object({
  name: z.string().min(1).max(80).nonempty("Enter your full name please!"),
  email: z
    .string()
    .nonempty("Email field cannot be empty!")
    .email("Email format is not valid!"),
  image: z.string().nonempty("Please upload a profile image!"),
  about: z.string(),
  type: z.preprocess(
    (val) => (val === null ? "" : val),
    z.string().nonempty("Select a ticket type!")
  ),
  unit: z.number(),
});
