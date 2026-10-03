import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import NetworkChartLoading from "@/components/NetworkChartLoading";
import { NetworkChart } from "@/components/NetworkChart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { NezhaServer } from "@/types/nezha-api";

type ServerListResponse = { success: boolean; data: NezhaServer[] };

async function fetchServers(): Promise<ServerListResponse> {
  const response = await fetch("/api/v1/server");
  const data = await response.json();
  if (!response.ok || data.error) throw new Error(data.error || `HTTP ${response.status}`);
  return data;
}

export default function NetworkPage() {
  const { t } = useTranslation();
  const { data, isLoading, error } = useQuery({
    queryKey: ["network-servers"],
    queryFn: fetchServers,
    refetchInterval: 30000,
    retry: 1,
  });

  if (isLoading) return <NetworkChartLoading />;
  if (error) return <p className="py-20 text-center text-sm text-muted-foreground">{String(error)}</p>;

  const servers = data?.data ?? [];
  return (
    <section className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold">{t("network.title", "网络延迟图表")}</h1>
        <p className="text-sm text-muted-foreground">{t("network.description", "查看和比较不同服务器的网络延迟")}</p>
      </div>
      {servers.length === 0 ? (
        <p className="py-20 text-center text-sm text-muted-foreground">{t("info.noServers", "暂无服务器")}</p>
      ) : (
        servers.map((server) => (
          <Card key={server.id}>
            <CardHeader><CardTitle>{server.name}</CardTitle></CardHeader>
            <CardContent><NetworkChart server_id={server.id} show={true} /></CardContent>
          </Card>
        ))
      )}
    </section>
  );
}
