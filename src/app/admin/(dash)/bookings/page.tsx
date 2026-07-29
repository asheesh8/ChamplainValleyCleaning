import { PageHeader, Panel, EmptyState, Th, Td } from "@/components/admin/ui";
import { Badge, statusTone } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { Input, Label, Select, Textarea } from "@/components/ui/Field";
import { deleteBookingAction, saveBookingAction } from "@/app/admin/actions";
import { getAdminBookings } from "@/lib/admin-data";
import { bookingStatuses } from "@/lib/validation";
import { formatCurrency, formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export const metadata = { title: "Schedule" };

export default async function BookingsPage() {
  const { upcoming, past, services } = await getAdminBookings();

  return (
    <>
      <PageHeader
        title="Schedule"
        description="Jobs on the calendar. Add one manually or convert a lead once it's confirmed."
      />

      <div className="grid gap-6 lg:grid-cols-[1fr_22rem]">
        <div className="space-y-6">
          <Panel title="Upcoming" description={`${upcoming.length} scheduled`}>
            {upcoming.length === 0 ? (
              <EmptyState
                title="Nothing scheduled"
                body="Add a job with the form and it will show up here and on the dashboard."
              />
            ) : (
              <BookingTable rows={upcoming} />
            )}
          </Panel>

          {past.length > 0 && (
            <Panel title="Past" description="Most recent 25.">
              <BookingTable rows={past} muted />
            </Panel>
          )}
        </div>

        <Panel title="Add a job">
          <form action={saveBookingAction} className="space-y-4 px-5 py-5">
            <div>
              <Label htmlFor="customerName" required>Customer</Label>
              <Input id="customerName" name="customerName" required />
            </div>

            <div>
              <Label htmlFor="scheduledFor" required>Date & time</Label>
              <Input
                id="scheduledFor"
                name="scheduledFor"
                type="datetime-local"
                required
              />
            </div>

            <div>
              <Label htmlFor="serviceId">Service</Label>
              <Select id="serviceId" name="serviceId" defaultValue="">
                <option value="">Not specified</option>
                {services.map((s) => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="durationMin">Minutes</Label>
                <Input
                  id="durationMin"
                  name="durationMin"
                  type="number"
                  min={15}
                  step={15}
                  defaultValue={120}
                />
              </div>
              <div>
                <Label htmlFor="price">Price ($)</Label>
                <Input id="price" name="price" type="number" min={0} />
              </div>
            </div>

            <div>
              <Label htmlFor="address">Address</Label>
              <Input id="address" name="address" />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="phone">Phone</Label>
                <Input id="phone" name="phone" type="tel" />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" />
              </div>
            </div>

            <div>
              <Label htmlFor="crew">Crew</Label>
              <Input id="crew" name="crew" placeholder="Who's going" />
            </div>

            <div>
              <Label htmlFor="status">Status</Label>
              <Select id="status" name="status" defaultValue="pending">
                {bookingStatuses.map((s) => (
                  <option key={s} value={s} className="capitalize">{s}</option>
                ))}
              </Select>
            </div>

            <div>
              <Label htmlFor="notes">Notes</Label>
              <Textarea id="notes" name="notes" className="min-h-20" />
            </div>

            <Button type="submit" className="w-full">Add to schedule</Button>
          </form>
        </Panel>
      </div>
    </>
  );
}

type Row = {
  id: string;
  customerName: string;
  scheduledFor: Date;
  durationMin: number;
  status: string;
  price: number | null;
  crew: string | null;
  address: string | null;
  service: { name: string } | null;
};

function BookingTable({ rows, muted }: { rows: Row[]; muted?: boolean }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[38rem] text-sm">
        <thead className="border-b border-border-base">
          <tr>
            <Th>When</Th>
            <Th>Customer</Th>
            <Th>Crew</Th>
            <Th>Price</Th>
            <Th className="text-right">Status</Th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border-base">
          {rows.map((b) => (
            <tr key={b.id} className={muted ? "opacity-70" : undefined}>
              <Td className="whitespace-nowrap">
                <span className="font-medium text-text">
                  {formatDate(b.scheduledFor, {
                    weekday: "short",
                    month: "short",
                    day: "numeric",
                  })}
                </span>
                <span className="block text-xs text-text-subtle">
                  {formatDate(b.scheduledFor, {
                    hour: "numeric",
                    minute: "2-digit",
                  })}{" "}
                  · {b.durationMin} min
                </span>
              </Td>
              <Td>
                <span className="font-medium text-text">{b.customerName}</span>
                <span className="block text-xs text-text-subtle">
                  {b.service?.name ?? "—"}
                  {b.address ? ` · ${b.address}` : ""}
                </span>
              </Td>
              <Td className="text-text-muted">{b.crew ?? "—"}</Td>
              <Td className="tabular-nums text-text-muted">
                {b.price != null ? formatCurrency(b.price) : "—"}
              </Td>
              <Td>
                <div className="flex items-center justify-end gap-2">
                  <Badge tone={statusTone[b.status] ?? "neutral"}>{b.status}</Badge>
                  <form action={deleteBookingAction}>
                    <input type="hidden" name="id" value={b.id} />
                    <button
                      type="submit"
                      aria-label={`Delete booking for ${b.customerName}`}
                      className="grid size-8 place-items-center rounded-field text-text-subtle transition-colors hover:bg-surface-2 hover:text-text"
                    >
                      <Icon name="trash" className="size-4" />
                    </button>
                  </form>
                </div>
              </Td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
