import React from "react";
import { CalendarDays, EllipsisVertical, PiggyBank } from "lucide-react";
import { AccountData } from "@/types";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";
import FormatNumber from "@/utils/formatNumber";
import FormatString from "@/utils/formatString";
import useEmblaCarousel from "embla-carousel-react";
import ManageAccounts from "@/app/(finance)/accounts/_components/manage/ManageAccounts";

type Props = {
  accountData: AccountData[];
};

export default function DashboardAccounts({ accountData }: Props) {
  const [emblaRef] = useEmblaCarousel({ containScroll: false });

  return (
    <div className="flex h-full flex-col gap-4 rounded-xl bg-white shadow-card-shadow">
      <div className="flex items-center justify-between px-6 pt-6">
        <h2 className="text-xl font-bold">Accounts</h2>
        <ManageAccounts accountData={accountData} />
      </div>
      {/* Account cards */}
      <div className="select-none overflow-hidden px-6" ref={emblaRef}>
        <div className="carousel__container">
          {accountData.map((item) => (
            <div
              key={item.id}
              className="h-full min-w-0 flex-none basis-full pl-4"
            >
              <div
                className={cn(
                  "flex h-full flex-col gap-6 rounded-xl bg-gradient-to-bl p-6",
                  item.color,
                )}
              >
                {/* Name */}
                <div className="flex items-center justify-between">
                  <div className="text-lg font-semibold text-white">
                    {item?.name}
                  </div>
                  <Button
                    size="icon"
                    className="rounded-full bg-transparent hover:bg-white/20"
                  >
                    <EllipsisVertical
                      className="h-6 w-6 text-white/50"
                      strokeWidth={1.5}
                    />
                  </Button>
                </div>
                {/* Amount */}
                <div className="flex justify-between">
                  {/* Checking - Debit */}
                  {item.type === "checking" && (
                    <div className="flex flex-col gap-1">
                      <div className="text-2xl tracking-wide text-white">
                        ${<FormatNumber number={Number(item?.amount)} />}
                      </div>
                      <div className="text-xs tracking-wide text-white/50">
                        Current balance
                      </div>
                    </div>
                  )}
                  {/* Credit */}
                  {item.type === "credit" && (
                    <>
                      <div className="flex flex-col gap-1">
                        <div className="text-2xl tracking-wide text-white">
                          ${<FormatNumber number={Number(item?.debt)} />}
                        </div>
                        <div className="text-xs tracking-wide text-white/50">
                          Current balance
                        </div>
                      </div>
                      <div className="flex flex-col gap-1">
                        <div className="text-2xl tracking-wide text-white">
                          ${<FormatNumber number={Number(item?.amount)} />}
                        </div>
                        <div className="text-xs tracking-wide text-white/50">
                          Available credit
                        </div>
                      </div>
                    </>
                  )}
                </div>
                {/* Type */}
                <div className="flex w-full items-center justify-end gap-4 text-sm text-white">
                  <div className="text-sm font-semibold text-white">
                    {
                      <FormatString
                        text={item?.type === "checking" ? "Debit" : item.type}
                      />
                    }
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Buttons */}
      <div className="grid grid-cols-2 gap-4 px-6 pb-6">
        <Button asChild variant="outline">
          <Link href="/recurring">
            <CalendarDays />
            Upcoming bills
          </Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/saving">
            <PiggyBank />
            Saving goals
          </Link>
        </Button>
      </div>
    </div>
  );
}
