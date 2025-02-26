import React from "react";
import { CalendarDays, EllipsisVertical, PiggyBank } from "lucide-react";
import Link from "next/link";
import { AccountDataType } from "@/types";
// import FormatString from "@/utils/formatString";
import FormatNumber from "@/utils/formatNumber";
import Image from "next/image";
import MasterCardSVG from "@/public/svg/cards/mastercard.svg";
import AddAccount from "@/app/(finance)/accounts/_components/AddAccount";
import { Button } from "@/components/ui/button";

type Props = {
  accountData: AccountDataType[];
};

export default function DashboardAccount({ accountData }: Props) {
  return (
    <div className="flex h-full flex-col gap-4 rounded-2xl bg-white p-6 shadow-card-shadow">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">Accounts</h2>
        <AddAccount />
      </div>
      {/* Accounts */}
      <div className="flex flex-col justify-center gap-2 text-base font-medium">
        <div className="relative flex w-full flex-col justify-between gap-8 overflow-hidden rounded-xl bg-gradient-to-bl from-blue-600 to-blue-800 p-6">
          <div className="flex flex-col gap-4">
            {/* Top */}
            <div className="flex items-center justify-between">
              <div className="text-lg font-semibold text-white">
                {accountData[0]?.name}
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
            {/* Middle */}
            <div className="flex justify-between">
              <div className="flex flex-col gap-1">
                <div className="text-2xl tracking-wide text-white">
                  ${<FormatNumber number={Number(accountData[0]?.debt)} />}
                </div>
                <div className="text-xs tracking-wide text-white/50">
                  Current balance
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <div className="text-2xl tracking-wide text-white">
                  ${<FormatNumber number={Number(accountData[0]?.amount)} />}
                </div>
                <div className="text-xs tracking-wide text-white/50">
                  Available credit
                </div>
              </div>
            </div>
          </div>
          {/* Bottom */}
          <div className="flex w-full items-center justify-end gap-4 text-sm text-white">
            {/* <div className="text-sm font-semibold text-white">
              {<FormatString text={accounts[0]?.type} />}
            </div> */}
            <Image src={MasterCardSVG} alt="Card" width={40} />
          </div>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Button asChild variant="outline" className="gap-2">
          <Link href="/recurring">
            <CalendarDays className="h-6 w-6" strokeWidth={1.5} />
            Upcoming Bills
          </Link>
        </Button>
        <Button asChild variant="outline" className="gap-2">
          <Link href="/saving">
            <PiggyBank className="h-6 w-6" strokeWidth={1.5} />
            Saving Goals
          </Link>
        </Button>
      </div>
    </div>
  );
}
