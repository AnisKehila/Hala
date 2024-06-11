import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger
} from "@renderer/components/ui/dialog";
import { Button } from "./ui/button";
import { useState } from "react";
import { Input } from "./ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "./ui/calendar";
import { cn } from "@renderer/utils";
import { format } from "date-fns";
import { arDZ } from "date-fns/locale";
import { useToast } from "./ui/use-toast";

const isDressAvailable = (
  dress: Dress,
  requestedPeriod: RentPeriod
): boolean => {
  for (const period of dress.rent || []) {
    if (
      (requestedPeriod.start >= period.start &&
        requestedPeriod.start <= period.end) ||
      (requestedPeriod.end >= period.start &&
        requestedPeriod.end <= period.end) ||
      (requestedPeriod.start <= period.start &&
        requestedPeriod.end >= period.end)
    ) {
      return false; // Overlapping periods
    }
  }
  return true; // No overlapping periods
};

export default function Rent({
  dress,
  setDresses
}: {
  dress: Dress;
  setDresses: React.Dispatch<React.SetStateAction<Dress[]>>;
}) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [price, setPrice] = useState("");
  const [isPayed, setIsPayed] = useState(false);
  const [payedAmount, setPayedAmount] = useState("");
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!name || !phone || !start || !end || !price || !payedAmount) {
      toast({
        variant: "destructive",
        title: "الرجاء ملئ جميع الحقول."
      });
      return;
    }
    //check if the dress is already rented in that period
    if (
      dress.rent &&
      dress.rent.length > 0 &&
      !isDressAvailable(dress, { start, end })
    ) {
      toast({
        variant: "destructive",
        title: "الفستان مأجر في هذه الفترة."
      });
      return;
    }
    setDresses((prev) => {
      const newDresses = prev.map((d) => {
        if (d.id === dress.id) {
          return {
            ...d,
            rent: [
              ...(d.rent || []),
              {
                id: d.rent?.length ? d.rent[d.rent.length - 1].id + 1 : 0,
                person: { name, phone, address },
                start,
                end,
                rentPrice: price,
                payedAmount,
                payed: isPayed
              }
            ]
          };
        }
        return d;
      });
      return newDresses;
    });
    setName("");
    setPhone("");
    setAddress("");
    setStart("");
    setEnd("");
    toast({
      title: "تمت العملية بنجاح",
      description: "تمت عملية كراء الفستان بنجاح"
    });
  };
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="rounded-full">كـراء الفستان</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle className="text-right p-1 px-2">كـراء الفستان</DialogTitle>
        <div className="p-2">
          <img src={dress.image} alt={dress.name} className="w-full max-h-56" />
          <form onSubmit={handleSubmit} className="flex flex-col gap-2 mt-8">
            <Input
              type="text"
              placeholder="أسم الزبـون الكامل"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <Input
              type="text"
              placeholder="رقم الهاتف"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
            <Input
              type="text"
              placeholder="العنوان"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
            <div className="flex gap-2">
              <Input
                type="text"
                placeholder="السعر"
                value={price}
                onChange={(e) => setPrice(e.target.value.replace(/\D/g, ""))}
              />
              <Input
                type="text"
                placeholder="المبلغ المدفوع"
                value={payedAmount}
                onChange={(e) =>
                  setPayedAmount(e.target.value.replace(/\D/g, ""))
                }
              />
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="payed"
                checked={isPayed}
                onChange={(e) => setIsPayed(e.target.checked)}
              />
              <label htmlFor="payed">تم الدفع</label>
            </div>
            <div className="w-full flex items-center gap-2">
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
                      <span>تاريخ الاسترجاع</span>
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
            <Button type="submit">كـراء</Button>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
