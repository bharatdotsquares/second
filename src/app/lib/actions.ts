'use server';
 
import { signIn } from '@/auth'; 
export async function authenticate(
  prevState: string | undefined,
  formData: FormData,
):Promise<{
  ok: boolean;
}> {
    await signIn("credentials", {
      email: formData.get("email"),
      password: formData.get("password"),
      redirect: true,
      redirectTo:"/"
    });
    return { ok: true };
}