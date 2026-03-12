import { LoginSchemaValue } from "@/schema/auth.schema";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import LoginGoogleButton from "../login-google-button";

const initValue: LoginSchemaValue = {
  email: "",
  password: "",
};

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <Card className={cn("w-full max-w-[500px] mx-auto", className)} {...props}>
      <CardHeader>
        <CardTitle>ເຂົ້າສູ່ບັນຊີຂອງທ່ານ</CardTitle>
        <CardDescription>
          ປ້ອນອີເມວແລະລະຫັດຜ່ານຂອງທ່ານຂ່າງລຸ່ມນີ້ເພື່ອເຂົ້າສູ່ບັນຊີຂອງທ່ານ
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="email">ອີເມວ</FieldLabel>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                required
              />
            </Field>
            <Field>
              <div className="flex items-center">
                <FieldLabel htmlFor="password">ລະຫັດຜ່ານ</FieldLabel>
                <a
                  href="#"
                  className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                >
                  ລືມລະຫັດຜ່ານຂອງທ່ານ?
                </a>
              </div>
              <Input id="password" type="password" required />
            </Field>
            <Field>
              <Button type="submit">ເຂົ້າສູ່ລະບົບ</Button>
              <LoginGoogleButton />
              <FieldDescription className="text-center">
                ທ່ານຍັງບໍ່ມີບັນຊີ? <a href="#">ສະຫມັກຂອງທ່ານບັນຊີ</a>
              </FieldDescription>
            </Field>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  );
}
