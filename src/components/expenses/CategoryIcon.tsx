import type { ExpenseCategory } from '@/lib/types'; // ExpenseCategory is now string
import { UtensilsCrossed, Plane, Home, Gamepad2, ShoppingBag, HeartPulse, ReceiptText, Gift, CircleDollarSign, LucideProps, Package } from 'lucide-react';
import type { ForwardRefExoticComponent, RefAttributes } from 'react';

interface CategoryIconProps extends LucideProps {
  category: ExpenseCategory; // This is now a string
}

// Keep a map for common, known categories (case-insensitive matching)
const iconMap: Record<string, ForwardRefExoticComponent<Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>>> = {
  food: UtensilsCrossed,
  travel: Plane,
  utilities: Home,
  entertainment: Gamepad2,
  shopping: ShoppingBag,
  health: HeartPulse,
  bills: ReceiptText,
  gifts: Gift,
  other: CircleDollarSign,
};

export function CategoryIcon({ category, className, ...props }: CategoryIconProps) {
  const normalizedCategory = category.toLowerCase().trim();
  const IconComponent = iconMap[normalizedCategory] || Package; // Default to Package icon
  return <IconComponent className={className} {...props} />;
}
