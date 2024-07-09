"use client";
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import useFetchData from "@/hooks/supabase/useFetchData";
import { supabase } from "@/lib/supabase/client";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";

import { PaymentTransactionsList } from "../payment-transaction-list/client";
import { ViewingHistoryList } from "../viewing-history-list/client";
import { PayoutTransactionList } from "../payout-transaction-list/client";

export default function UserDashboard({ userId }: { userId: string }) {
  const {
    data: userInfo,
    error,
    refetch,
  } = useFetchData({
    query: supabase
      .from("profiles")
      .select("*")
      .match({
        id: userId,
      })
      .single(),
  });

  console.log({ userInfo, error });

  return (
    <div className="p-5 pt-0">
      <div className="flex items-start justify-between mb-5">
        <Heading
          title={`User ` + userInfo?.phone_number}
          description="User Details"
        />
      </div>

      <Tabs defaultValue="account" className="mt-3">
        <TabsList>
          <TabsTrigger value="account">Payment Transactions</TabsTrigger>
          <TabsTrigger value="password">Viewing History</TabsTrigger>
          <TabsTrigger value="payout">Payout History</TabsTrigger>
        </TabsList>
        <Separator className="mt-3" />
        <TabsContent value="account">
          <PaymentTransactionsList user_id={userId} />
        </TabsContent>
        <TabsContent value="password">
          <ViewingHistoryList user_id={userId} />{" "}
        </TabsContent>
        <TabsContent value="payout">
          <PayoutTransactionList user_id={userId} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
