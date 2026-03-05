import { Home, StickyNote, Gamepad2, Smartphone, Gift, Ticket } from "lucide-react";


export const NavbarData = [
    {
    icon:<button><Home strokeWidth={3} className="text-[#0ca1ff]" /></button>,
    link:'/'
    },
    {
    icon:<button><Smartphone strokeWidth={3} className="text-[#0ca1ff]" /></button>,
    link:'/apps'
    },
    {
    icon:<button><Gift strokeWidth={3} className="text-[#0ca1ff]" /></button>,
    link:'/rewards'
    },
    {
    icon:<button><Ticket strokeWidth={3} className="text-[#0ca1ff]" /></button>,
    link:'/redeem'
    }
    ]
