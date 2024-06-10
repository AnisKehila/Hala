import {
  Drawer,
  DrawerContent,
  DrawerTitle,
  DrawerTrigger,
  DrawerClose
} from "./ui/drawer";
import { Button } from "./ui/button";
import { useEffect, useState } from "react";
import { Input } from "./ui/input";
import { format } from "date-fns";
import { arDZ } from "date-fns/locale";
import { Check, Pencil } from "lucide-react";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "./ui/calendar";
import { cn } from "@renderer/utils";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
export default function FullInfo({
  dress,
  setDresses,
  dresses
}: {
  dress: Dress;
  setDresses: React.Dispatch<React.SetStateAction<Dress[]>>;
  dresses: Dress[];
}) {
  const [search, setSearch] = useState("");
  const [filtred, setFiltred] = useState<Rent[]>(dress.rent || []);
  const [start, setStart] = useState<string>("");
  const [end, setEnd] = useState<string>("");
  useEffect(() => {
    setFiltred(
      dress.rent?.filter(
        (rent) =>
          rent.person?.name.toLowerCase().includes(search.toLowerCase()) &&
          (!start || new Date(rent.start) >= new Date(start)) &&
          (!end || new Date(rent.start) <= new Date(end))
      ) || []
    );
  }, [search, dress, start, end]);
  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button variant={"outline"} className="rounded-full">
          معلومات اضافية
        </Button>
      </DrawerTrigger>
      <DrawerContent className="container h-screen ">
        <DrawerClose className="text-right p-3 mx-2 border rounded-full flex items-center justify-center w-5 h-5 hover:text-red-500">
          x
        </DrawerClose>
        <DrawerTitle className="text-right p-1 px-2">
          معلومات عن الفستان
        </DrawerTitle>
        <div className="p-2 ">
          <img
            src={dress.image}
            alt={dress.name}
            className="w-32 h-32 rounded-md object-cover "
          />
          <span>{dress.name}</span>
          <div className="flex flex-col gap-2 mt-2">
            <div className="flex gap-4">
              <Input
                placeholder="ابحث عن الزبون"
                onChange={(e) => setSearch(e.target.value)}
                className="max-w-lg"
                value={search}
              />
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !start && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {start ? (
                      format(start, "EEEE, d MMMM yyyy", { locale: arDZ })
                    ) : (
                      <span>تاريخ البداية</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={new Date(start)}
                    onSelect={(e) => setStart(e?.toISOString() || "")}
                    initialFocus
                    locale={arDZ}
                  />
                </PopoverContent>
              </Popover>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !end && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {end ? (
                      format(end, "EEEE, d MMMM yyyy", { locale: arDZ })
                    ) : (
                      <span>تاريخ النهاية</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={new Date(end)}
                    onSelect={(e) => setEnd(e?.toISOString() || "")}
                    initialFocus
                    locale={arDZ}
                  />
                </PopoverContent>
              </Popover>
            </div>
            {/* //table of rents */}
            <div className=" h-[65vh] overflow-y-auto">
              <table className="w-full">
                <thead>
                  <tr>
                    <th className="text-right">الزبون</th>
                    <th className="text-right">الهاتف</th>
                    <th className="text-right">العنوان</th>
                    <th className="text-right">السعر</th>
                    <th className="text-right">المبلغ المدفوع</th>
                    <th className="text-right">الدفع</th>
                    <th className="text-right">البداية</th>
                    <th className="text-right">النهاية</th>
                  </tr>
                </thead>
                <tbody>
                  {filtred.map((rent, i) => (
                    <Row
                      key={i}
                      rent={rent}
                      i={i}
                      dresses={dresses}
                      setDresses={setDresses}
                      dress={dress}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}

const Row = ({
  rent,
  i,
  dresses,
  setDresses,
  dress
}: {
  rent: Rent;
  i: number;
  dresses: Dress[];
  setDresses: React.Dispatch<React.SetStateAction<Dress[]>>;
  dress: Dress;
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [payedAmount, setPayedAmount] = useState(rent.payedAmount || "");
  useEffect(() => {
    if (!isEditing) {
      const newDresses = dresses.map((d) => {
        if (d.id === dress.id) {
          return {
            ...d,
            rent: d.rent?.map((r) =>
              r.id === rent.id ? { ...r, payedAmount } : r
            )
          };
        }
        return d;
      });
      setDresses(newDresses);
    }
  }, [isEditing, payedAmount]);
  return (
    <tr>
      <td>{rent.person?.name}</td>
      <td>{rent.person?.phone}</td>
      <td>{rent.person?.address}</td>
      <td>{rent.rentPrice}</td>
      <td className="flex items-center gap-2">
        {!isEditing ? (
          <span>{rent.payedAmount}</span>
        ) : (
          <Input
            type="text"
            value={payedAmount}
            onChange={(e) => setPayedAmount(e.target.value.replace(/\D/g, ""))}
            className="max-w-24"
          />
        )}

        <span
          className="cursor-pointer text-blue-400"
          onClick={() => {
            setIsEditing(!isEditing);
          }}
        >
          {isEditing ? <Check /> : <Pencil />}
        </span>
      </td>
      <td>
        <div className="flex gap-2">
          <input
            type="checkbox"
            id={"payed" + i}
            checked={rent.payed}
            onChange={(e) => {
              const newRent = {
                ...rent,
                payed: e.target.checked
              };
              const newDresses = dresses.map((d) => {
                if (d.id === dress.id) {
                  return {
                    ...d,
                    rent: d.rent?.map((r) =>
                      r.start === rent.start ? newRent : r
                    )
                  };
                }
                return d;
              });
              setDresses(newDresses);
            }}
          />
          <label htmlFor={"payed" + i}>تم الدفع</label>
        </div>
      </td>
      <td>
        {format(rent.start, "EEEE, d MMMM yyyy", {
          locale: arDZ
        })}
      </td>
      <td>
        {format(rent.end, "EEEE, d MMMM yyyy", {
          locale: arDZ
        })}
      </td>
    </tr>
  );
};
