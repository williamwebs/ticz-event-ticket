interface NavLinkProps {
  name: string;
  url: string;
}

interface TicketTypeProps {
  label: string;
  htmlFor: string;
  pcs: number;
  price: string | number;
}

export const navLinks: NavLinkProps[] = [
  {
    name: "Events",
    url: "/",
  },
  {
    name: "My Tickets",
    url: "/my-tickets",
  },
  {
    name: "About Project",
    url: "/about-project",
  },
];

export const ticketTypes: TicketTypeProps[] = [
  {
    label: "Regular Access",
    htmlFor: "regular",
    pcs: 20,
    price: "Free",
  },
  {
    label: "VIP Access",
    htmlFor: "vip",
    pcs: 20,
    price: 50,
  },
  {
    label: "VVIP Access",
    htmlFor: "vvip",
    pcs: 20,
    price: 150,
  },
];
