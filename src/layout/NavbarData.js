import { Home, StickyNote, Gamepad2 } from "lucide-react";


export const NavbarData = [
    {
    icon:<button><Home strokeWidth={3} className="text-[#0ca1ff]" /></button>,
    link:'/'
    },
    {
        icon:<button><StickyNote strokeWidth={3} className="text-[#0ca1ff]" /></button>,
        link:'/comunidade'
        }
        ,
    {
        icon:<button><Gamepad2 strokeWidth={3} className="text-[#0ca1ff]" /></button>,
        link:'/pagames'
        }
    ]