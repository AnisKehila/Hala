import useStorage from "@renderer/hooks/useStorage";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@renderer/components/ui/dialog";

interface Dress {
  id: number;
  name: string;
  image: string;
}

function Home(): JSX.Element {
  const [dresses] = useStorage<Dress[]>("dresses", [
    {
      id: 1,
      name: "Dress 1",
      image:
        "https://images.unsplash.com/photo-1709402740448-c00125bc4e6f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxfDB8MXxyYW5kb218MHx8fHx8fHx8MTcxNzcxNDM3Mw&ixlib=rb-4.0.3&q=80&w=1080"
    }
  ]);

  return (
    <main>
      <h1>Home</h1>

      <ul>
        {dresses.map((dress) => (
          <li key={dress.id}>
            <img src={dress.image} alt={dress.name} />
            {dress.name}
          </li>
        ))}
      </ul>
      <Dialog>
        <DialogTrigger>Open</DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you absolutely sure?</DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete your
              account and remove your data from our servers.
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </main>
  );
}

export default Home;
