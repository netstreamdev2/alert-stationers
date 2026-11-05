/**
 * INTERIM icons, drawn to the Astra brief's UI grid (24px, 1.75 stroke, round caps).
 * Astra's production set (brand/icons/ui/) replaces these one-for-one by name.
 */
import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

function Icon({ children, className, ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      className={className ?? "size-6"}
      {...props}
    >
      {children}
    </svg>
  );
}

export function SearchIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <circle cx="11" cy="11" r="6.5" />
      <path d="m20 20-4.4-4.4" />
    </Icon>
  );
}

export function BagIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M5.5 8.5h13l-.9 10.2a2 2 0 0 1-2 1.8H8.4a2 2 0 0 1-2-1.8L5.5 8.5Z" />
      <path d="M9 10.5V7a3 3 0 0 1 6 0v3.5" />
    </Icon>
  );
}

export function HeartIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M12 19.5s-7.5-4.6-7.5-10A4.25 4.25 0 0 1 12 6.8a4.25 4.25 0 0 1 7.5 2.7c0 5.4-7.5 10-7.5 10Z" />
    </Icon>
  );
}

export function UserIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <circle cx="12" cy="8.5" r="3.5" />
      <path d="M5 19.5c1.3-3.3 3.9-5 7-5s5.7 1.7 7 5" />
    </Icon>
  );
}

export function MenuIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M4 7h16M4 12h16M4 17h10" />
    </Icon>
  );
}

export function CloseIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M6 6l12 12M18 6 6 18" />
    </Icon>
  );
}

export function ArrowRightIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M4.5 12h15M13.5 6l6 6-6 6" />
    </Icon>
  );
}

export function ArrowUpRightIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M7 17 17 7M8.5 7H17v8.5" />
    </Icon>
  );
}

export function ChevronRightIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="m9.5 6 6 6-6 6" />
    </Icon>
  );
}

export function CheckIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="m5 12.5 4.5 4.5L19 7.5" />
    </Icon>
  );
}

export function ClockIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <circle cx="12" cy="12" r="8" />
      <path d="M12 7.5V12l3 2" />
    </Icon>
  );
}

export function ShieldCheckIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M12 3.5 18.5 6v5.2c0 4.2-2.7 7.6-6.5 9.3-3.8-1.7-6.5-5.1-6.5-9.3V6L12 3.5Z" />
      <path d="m9.2 12 2 2 3.8-3.8" />
    </Icon>
  );
}

export function PulseIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M3.5 12h4l2-5 4 10 2-5h5" />
    </Icon>
  );
}

export function DevicesIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <rect x="2.5" y="4.5" width="12" height="9" rx="1.5" />
      <path d="M6.5 18.5h4M8.5 13.5v5" />
      <rect x="16" y="8.5" width="5.5" height="11" rx="1.25" />
      <path d="M18.25 17h1" />
    </Icon>
  );
}

export function SchoolListIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <rect x="5" y="4.5" width="14" height="16" rx="2" />
      <path d="M9 3.5h6v3H9z" />
      <path d="m8.5 11 1.25 1.25L12 10M14 11.25h2M8.5 16l1.25 1.25L12 15M14 16.25h2" />
    </Icon>
  );
}
