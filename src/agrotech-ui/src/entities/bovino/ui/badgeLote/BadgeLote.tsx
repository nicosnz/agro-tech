import { Badge } from "@/shared/ui/badge/Badge"

interface Props{
    lote:string
}


export const BadgeLote = ({lote}:Props) => {  
    return <Badge estado={lote} bg='"#eff6ff' border='#bfdbfe' color='#1d4ed8' dot='#1d4ed8'  />
}
