import AddDress from "@renderer/components/AddDress";
import { Input } from "@renderer/components/ui/input";
import useStorage from "@renderer/hooks/useStorage";
import { useEffect, useState } from "react";
import Empty from "@renderer/assets/empty.jpg";
import FullInfo from "@renderer/components/FullInfo";
import Rent from "@renderer/components/Rent";
function Home(): JSX.Element {
  const [localDresses, setLocalDresses] = useStorage<Dress[]>("dresses", []);
  const [dresses, setDresses] = useState<Dress[]>(localDresses);
  const [filtred, setFiltred] = useState<Dress[]>(dresses);
  const [search, setSearch] = useState<string>("");

  useEffect(() => {
    setLocalDresses(dresses);
  }, [dresses]);
  useEffect(() => {
    setFiltred(
      dresses.filter((dress) =>
        dress.name.toLowerCase().includes(search.toLowerCase())
      )
    );
  }, [search, dresses]);
  return (
    <main>
      <h1 className="text-3xl font-bold text-center p-6 border-b">
        كراء فساتين الأعراس
      </h1>
      <div className="flex p-6 items-start">
        <div className="w-[20rem] sticky top-4">
          <AddDress dresses={dresses} setDresses={setDresses} />
          <div className="mt-4 w-full">
            <Input
              placeholder="ابحث عن فستان"
              onChange={(e) => setSearch(e.target.value)}
              value={search}
            />
          </div>
        </div>
        {filtred.length > 0 && (
          <ul className="grid grid-cols-2 lg:grid-cols-4 gap-3 px-4 flex-1">
            {filtred.map((dress) => (
              <li
                key={dress.id}
                className="rounded-md overflow-hidden flex flex-col"
              >
                <img
                  src={dress.image}
                  alt={dress.name}
                  className="w-full object-cover bg-neutral-100 h-[160px]"
                />
                <div className="bg-slate-100 p-2 flex flex-col gap-3">
                  <span className="text-center font-semibold text-base">
                    {dress.name}
                  </span>
                  <div className="flex flex-col gap-1">
                    <Rent dress={dress} setDresses={setDresses} />
                    <FullInfo
                      dress={dress}
                      setDresses={setDresses}
                      dresses={dresses}
                    />
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
        {!filtred.length && (
          <div className="flex-1 flex items-center justify-center">
            <img src={Empty} alt="Empty" className="w-[600px] h-[600px]" />
          </div>
        )}
      </div>
    </main>
  );
}

export default Home;
