import { Card, CardContent } from "@/components/ui/card";
import { LayoutDashboard } from "lucide-react";
import Sticker from "./Sticker";

export default function UserListHero({ totalCount }) {
  return (
    <section className="relative px-6 md:px-12 pt-8 pb-12">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-10 items-start">
          <div className="text-center lg:text-left">
            <Sticker className="inline-flex items-center gap-2 px-5 py-2 mb-6">
              <span className="inline-flex h-3 w-3 rounded-full bg-lime-400 border-2 border-black" />
              <span className="font-black tracking-tight">
                MOA 관리자 · 회원 관리 센터
              </span>
            </Sticker>

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-black leading-[0.95] tracking-tight mb-6">
              회원목록
            </h1>
          </div>

          <div className="flex justify-center lg:justify-end">
            <div className="relative w-full max-w-md">
              <div className="absolute -top-4 -left-4 w-full h-full bg-cyan-400 rounded-3xl border-4 border-black -z-10" />
              <div className="absolute -top-8 -left-8 w-full h-full bg-pink-400 rounded-3xl border-4 border-black -z-20" />

              <Card className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] rounded-3xl overflow-hidden">
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-lime-400 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center">
                      <LayoutDashboard className="w-6 h-6 text-black" />
                    </div>
                    <div>
                      <p className="text-lg md:text-xl font-black text-black">
                        MOA 회원{" "}
                        <span className="text-pink-500">
                          {(totalCount ?? 0).toLocaleString()}명
                        </span>
                      </p>
                    </div>
                  </div>

                  <div className="h-2 bg-black rounded-full" />
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
