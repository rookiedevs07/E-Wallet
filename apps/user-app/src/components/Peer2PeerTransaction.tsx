import { Card } from "@repo/ui/card";
import { TransactionType } from "@/types/type";
import { Avatar, AvatarImage } from "@radix-ui/react-avatar";
import Image from "next/image";
export const Peer2PeerTransactions = ({
  transactions,
}: {
  transactions: {
    amount: number;
    time: Date;
    name: string;
    status: string;
    type: TransactionType; // Use the enum here for type safety
  }[];
}) => {
  if (!transactions.length) {
    return (
      <Card title="P2P Transactions">
        <div className="text-center pb-8 pt-8">No P2P transactions</div>
      </Card>
    );
  }
  return (
    <Card title="P2P Transactions">
      <div className="max-h-[320px] overflow-auto overflow-x-hidden">
        {transactions.map((t, index) => {
          return (
            <div
              key={index}
              className="flex justify-between py-[5px] border-b-2 border-[#cbd5e1]"
            >
              <div className="gap-2 flex items-center">
                <div>
                  <Avatar>
                    <AvatarImage asChild src="/money-bag.png">
                      <Image
                        src="/money-bag.png"
                        alt="logo"
                        width={30}
                        height={30}
                      />
                    </AvatarImage>
                  </Avatar>
                </div>
                <div className="flex flex-col">
                  <div>{t?.name}</div>
                  <div>{new Date(t.time).toDateString()}</div>
                </div>
              </div>

              <div className="flex flex-col">
                <div
                  className={`${
                    t?.type === TransactionType.Credit
                      ? "text-[green]" // Green for credit
                      : "text-[red]" // Red for debit
                  }`}
                >
                  {/* Prefix '-' for debit and '+' for credit */}
                  {t?.type === TransactionType.Debit
                    ? `- ₹${t.amount}`
                    : `+ ₹${t.amount}`}
                </div>
                <div>{t?.status}</div>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
};
