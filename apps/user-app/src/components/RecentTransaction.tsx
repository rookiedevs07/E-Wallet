import { Card } from "@repo/ui/card";

export const RecentTransactions = ({
  transactions,
}: {
  transactions: {
    time: Date;
    amount: number;
    status: string;
    provider: string;
  }[];
}) => {
  if (!transactions.length) {
    return (
      <Card title="Recent Transactions">
        <div className="text-center pb-8 pt-8">No Recent transactions</div>
      </Card>
    );
  }

  return (
    <Card title="Recent Transactions">
      <div className="pt-2 overflow-auto overflow-x-hidden max-h-[400px]">
        {transactions.map((t, index) => (
          <div
            key={index}
            className="flex flex-col gap-1 py-[5px] border-b-2 border-[#cbd5e1]"
          >
            <div className="flex justify-between">
              <div>{t.provider}</div>
              <div
                className={`${t.provider === "SELF" ? "text-[red]" : "text-[green]"}`}
              >
                {t.provider === "SELF" ? `-₹${t.amount}` : `+₹${t.amount}`}
              </div>
            </div>
            <div className="flex justify-between">
              <div>{t.time.toISOString()}</div> {/* Format the date/time */}
              <div>{t.status}</div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};
