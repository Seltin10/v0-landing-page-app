import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

interface Partner {
  id: number
  name: string
  cnpj: string
  email: string
  phone: string | null
  category: string | null
  city: string | null
  state: string | null
  is_active: boolean
  coupon_count: number
}

export function PartnersTable({ partners }: { partners: Partner[] }) {
  if (partners.length === 0) {
    return (
      <div className="border rounded-lg p-8 text-center">
        <p className="text-muted-foreground">Nenhum parceiro cadastrado</p>
      </div>
    )
  }

  return (
    <div className="border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nome</TableHead>
            <TableHead>CNPJ</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Localização</TableHead>
            <TableHead>Cupons</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {partners.map((partner) => (
            <TableRow key={partner.id}>
              <TableCell className="font-medium">{partner.name}</TableCell>
              <TableCell className="font-mono text-sm">{partner.cnpj}</TableCell>
              <TableCell>{partner.email}</TableCell>
              <TableCell>{partner.city && partner.state ? `${partner.city}, ${partner.state}` : "-"}</TableCell>
              <TableCell>{partner.coupon_count}</TableCell>
              <TableCell>
                <Badge variant={partner.is_active ? "default" : "secondary"}>
                  {partner.is_active ? "Ativo" : "Inativo"}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
