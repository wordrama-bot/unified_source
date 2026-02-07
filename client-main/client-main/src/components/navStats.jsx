import { BanknotesIcon, StarIcon } from '@heroicons/react/24/outline';
import { useUser } from '../providers/websocketProvider';

function Divider() {
  return (
    <div className="inline-block h-[24px] min-h-[1em] w-0.5 self-stretch bg-neutral-100 opacity-100 dark:opacity-50"/>
  )
}

export default function NavStats({ isMenu = false }){
  const { coinBalance, xpLevel } = useUser();
  const { xp, level } = xpLevel; 
  return (
    isMenu ? (
      <div className="flex items-center gap-x-4">
        <BanknotesIcon className="h-6 w-6" aria-hidden="true" />
        <p className="select-none">{ coinBalance }</p>
      </div>
    ) : (
      <div className="flex items-center gap-x-4">
        Beta v1
        <Divider />
        { xp !== undefined ? <p className="select-none">{ xp } xp</p> : null }
        <Divider />
        { 
          level !== undefined ? (
            <>
              <p className="select-none">{ level }</p>
              <StarIcon className="h-6 w-6" aria-hidden="true" />
            </>
          ) : null 
        }
        <Divider />
        {
          coinBalance !== undefined ? (
            <>
              <p className="select-none">{ coinBalance }</p>
              <BanknotesIcon className="h-6 w-6" aria-hidden="true" />
            </>
          ) : null  
        }
        <Divider />
      </div>
    )
  )
};
