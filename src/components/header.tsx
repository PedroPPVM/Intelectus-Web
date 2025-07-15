import { CompanyCombobox } from './companyCombobox';
import { ModeToggle } from './theme-toggle';
import { Separator } from './ui/separator';
import { SidebarTrigger } from './ui/sidebar';

const Header = () => {
  return (
    <div className="border-b">
      <div className="flex h-16 w-full items-center gap-6 px-6">
        <SidebarTrigger />

        <span>Logo</span>

        <Separator orientation="vertical" className="h-6" />

        <div className="hidden md:block">
          <CompanyCombobox />
        </div>

        <div className="flex w-full items-end justify-end">
          <ModeToggle />
        </div>
      </div>
    </div>
  );
};

export default Header;
