"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { StatusBadge } from "@/components/shared/status-badge";
import { campaigns } from "@/lib/mock-data";

export function TopCampaignsTable() {
  const topCampaigns = [...campaigns]
    .filter((c) => c.status === "active")
    .sort((a, b) => b.totalImpressions - a.totalImpressions)
    .slice(0, 5);

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold">
          Top Campañas Activas
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-xs uppercase text-muted-foreground">
                Campaña
              </TableHead>
              <TableHead className="text-xs uppercase text-muted-foreground">
                Anunciante
              </TableHead>
              <TableHead className="text-xs uppercase text-muted-foreground text-right">
                Impresiones
              </TableHead>
              <TableHead className="text-xs uppercase text-muted-foreground text-right">
                CTR
              </TableHead>
              <TableHead className="text-xs uppercase text-muted-foreground text-right">
                Estado
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {topCampaigns.map((campaign) => (
              <TableRow key={campaign.id} className="hover:bg-muted/50">
                <TableCell className="font-medium text-sm">
                  {campaign.name}
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {campaign.advertiserName}
                </TableCell>
                <TableCell className="text-sm text-right tabular-nums">
                  {campaign.totalImpressions.toLocaleString()}
                </TableCell>
                <TableCell className="text-sm text-right tabular-nums">
                  {campaign.ctr.toFixed(1)}%
                </TableCell>
                <TableCell className="text-right">
                  <StatusBadge status={campaign.status} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
