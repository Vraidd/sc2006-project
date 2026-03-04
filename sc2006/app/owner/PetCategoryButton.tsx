import { JSX, MouseEventHandler } from "react";

interface PetCategoryButtonProps {
    name?: string,
    icon?: string | JSX.Element,
    borderColor?: string,
    bgColor?: string,
    iconColor?: string,
    selected?: boolean,
    onClick?:MouseEventHandler<HTMLButtonElement>,
}

export default function PetCategoryButton({
    name = "",
    icon = "",
    borderColor = "border-gray-200",
    bgColor = "bg-gray-50",
    iconColor = "text-gray-400",
    selected = false,
    onClick,
} : PetCategoryButtonProps) {
    return (
        <button
            key={name}
            onClick={onClick}
            className={`
                flex flex-col items-center justify-center w-40 h-28 rounded-2xl border-2 transition-all cursor-pointer relative
                ${borderColor} ${bgColor}
                /* Use brightness to darken the existing category colors instead of hardcoding teal */
                ${selected 
                    ? 'border-4 scale-105 font-extrabold brightness-90 shadow-inner' 
                    : 'bg-opacity-50 hover:shadow-md hover:brightness-95' // adjust brightness lower to make it stand out
                }
            `}      
        >
            <span className={`text-3xl mb-2 ${iconColor}`}>
                {icon}
            </span>
            <span className="text-md font-semibold text-gray-700">
                {name}
            </span>
        </button>
    )
}