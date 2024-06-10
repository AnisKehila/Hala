import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger
} from "@renderer/components/ui/dialog";
import { Button } from "./ui/button";
import { useState } from "react";
import { Input } from "./ui/input";
import { useToast } from "./ui/use-toast";
export default function AddDress({
  dresses,
  setDresses
}: {
  dresses: Dress[];
  setDresses: React.Dispatch<React.SetStateAction<Dress[]>>;
}) {
  const [dressName, setDressName] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [imagePrev, setImagePrev] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!dressName) {
      toast({
        variant: "destructive",
        title: "الرجاء ادخال اسم الفستان."
      });
      return;
    }
    if (!image) {
      toast({
        variant: "destructive",
        title: "الرجاء اختيار صورة للفستان."
      });
      return;
    }
    try {
      window.electron.ipcRenderer.send("save-image", {
        name: `${image.name.split(".")[0]}${new Date().toString().split(" ").join("_")}.${image.name.split(".")[1]}`.replace(
          /:/g,
          "_"
        ),
        imagePath: image.path
      });
      window.electron.ipcRenderer.on("image-saved", (_, savePath) => {
        if (!savePath) {
          toast({
            variant: "destructive",
            title: "خطأ!"
          });
          return;
        }

        setDresses([
          ...dresses,
          { id: dresses.length + 1, name: dressName, image: savePath }
        ]);
      });
      setDressName("");
      setImage(null);
      setImagePrev(null);
      toast({
        title: "تمت الاضافة بنجاح",
        description: "تمت اضافة الفستان بنجاح"
      });
    } catch (e) {
      console.error(e);
      toast({
        variant: "destructive",
        description: "خطأ غير متوقع! حاول مرة اخرى."
      });
    }
  };
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];

    // Check if dropped item is a file
    if (file) {
      // Check if the file is an image
      if (file.type.startsWith("image/")) {
        setImage(file);
        const reader = new FileReader();
        reader.onload = () => {
          setImagePrev(reader.result as string);
        };
        reader.readAsDataURL(file);
      } else {
        toast({
          variant: "destructive",
          title: "الرجاء اختيار ملف صورة.",
          description: "الملف الذي اخترته ليس صورة."
        });
      }
    }
  };
  const handleChooseImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      if (file.type.startsWith("image/")) {
        setImage(file);
        const reader = new FileReader();
        reader.onload = () => {
          setImagePrev(reader.result as string);
        };
        reader.readAsDataURL(file);
      } else {
        toast({
          variant: "destructive",
          title: "الرجاء اختيار ملف صورة.",
          description: "الملف الذي اخترته ليس صورة."
        });
      }
    }
  };
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-3 w-full">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path d="M5 12h14" />
            <path d="M12 5v14" />
          </svg>
          اضافة فستان
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle className="text-right p-1 px-2">
          اضافة فستان جديد
        </DialogTitle>
        <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
          {imagePrev && (
            <div className="w-full flex justify-end">
              <Button className="mt-2 p-0" variant="secondary" type="button">
                <label
                  htmlFor="file-upload"
                  className="text-sm text-end cursor-pointer text-primary-500 px-2"
                >
                  تغيير الصورة
                </label>
              </Button>
            </div>
          )}
          <Input
            type="text"
            placeholder="اسم الفستان"
            value={dressName}
            onChange={(e) => setDressName(e.target.value)}
          />
          <div
            className={`
                    w-full rounded-lg overflow-hidden shadow-md mt-4 flex items-center justify-center aspect-square
                    ${
                      isDragging
                        ? " border-dashed border-4 border-secondary"
                        : ""
                    }
                  `}
          >
            <div
              onDragEnter={() => setIsDragging(true)}
              onDragLeave={handleDragOver}
              onDragOver={(e) => {
                e.preventDefault();
              }}
              onDrop={handleDrop}
              className="w-full h-full flex items-center justify-center "
            >
              {imagePrev ? (
                <img
                  src={imagePrev}
                  alt="Dropped"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex flex-col items-center gap-2">
                  <p>Drag & drop an image here</p>
                  <Button
                    className="w-full flex p-0"
                    variant="secondary"
                    type="button"
                  >
                    <label
                      htmlFor="file-upload"
                      className="text-sm p-2 cursor-pointer text-primary-500 w-full h-full"
                    >
                      اختيار صورة
                    </label>
                  </Button>
                </div>
              )}
            </div>
          </div>
          <input
            type="file"
            accept="image/*"
            hidden
            id="file-upload"
            name="file-upload"
            onChange={handleChooseImage}
          />
          <Button>اضافة</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
