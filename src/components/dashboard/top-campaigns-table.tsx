"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { StatusBadge } from "@/components/shared/status-badge";
import { MoreVertical, ChevronLeft, ChevronRight } from "lucide-react";

const stitchCampaigns = [
  {
    id: "stitch-1",
    name: "Promo Medalla Light",
    advertiserName: "Medalla Light",
    totalImpressions: 4200,
    ctr: 5.1,
    status: "active" as const,
  },
  {
    id: "stitch-2",
    name: "Sabor de Goya",
    advertiserName: "Goya Foods PR",
    totalImpressions: 3800,
    ctr: 4.8,
    status: "active" as const,
  },
  {
    id: "stitch-3",
    name: "Pan Pepin Fresco",
    advertiserName: "Pan Pepin",
    totalImpressions: 3100,
    ctr: 4.2,
    status: "active" as const,
  },
  {
    id: "stitch-4",
    name: "Walmart Ofertas Semanales",
    advertiserName: "Walmart PR",
    totalImpressions: 2900,
    ctr: 3.9,
    status: "active" as const,
  },
  {
    id: "stitch-5",
    name: "Plaza Aniversario",
    advertiserName: "Plaza Las Americas",
    totalImpressions: 2500,
    ctr: 4.5,
    status: "active" as const,
  },
];

function formatImpressions(value: number): string {
  return value >= 1000 ? `${(value / 1000).toFixed(1)}K` : value.toString();
}

export function TopCampaignsTable() {
  return (
    <Card className="rounded-xl border-slate-100 shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-bold tracking-tight">
          Top Campanas Activas
        </CardTitle>
        <Link
          href="/campaigns"
          className="text-sm font-medium text-primary hover:underline"
        >
          Ver todas las campanas
        </Link>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-xs uppercase text-muted-foreground">
                Campana
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
              <TableHead className="text-xs uppercase text-muted-foreground text-right">
                Accion
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {stitchCampaigns.map((campaign) => (
              <TableRow key={campaign.id} className="hover:bg-muted/50">
                <TableCell className="font-medium text-sm">
                  {campaign.name}
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {campaign.advertiserName}
                </TableCell>
                <TableCell className="text-sm text-right tabular-nums">
                  {formatImpressions(campaign.totalImpressions)}
                </TableCell>
                <TableCell className="text-sm text-right tabular-nums">
                  {campaign.ctr.toFixed(1)}%
                </TableCell>
                <TableCell className="text-right">
                  <StatusBadge status={campaign.status} />
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {/* Pagination footer */}
        <div className="flex items-center justify-between pt-4 border-t mt-4">
          <span className="text-sm text-muted-foreground">
            Mostrando 5 de 9 campanas activas
          </span>
          <div className="flex items-center gap-1">
            <Button variant="outline" size="sm" className="h-8 w-8 p-0" disabled>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" className="h-8 w-8 p-0">
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
