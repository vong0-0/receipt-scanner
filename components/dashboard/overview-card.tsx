import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { TbTrendingUp, TbTrendingDown } from "react-icons/tb";
import { Badge } from "@/components/ui/badge";

export default function OverviewCard({
  title,
  value,
  footerDescription,
}: {
  title: string;
  value: string;
  footerDescription: string;
}) {
  return (
    <Card className="@container/card">
      <CardHeader>
        <CardDescription>{title}</CardDescription>
        <CardTitle className="text-2xl font-semibold @[250px]/card:text-xl">
          {value}
        </CardTitle>
      </CardHeader>
      <CardFooter className="font-medium text-sm">
        {footerDescription}
      </CardFooter>
    </Card>
  );
}
