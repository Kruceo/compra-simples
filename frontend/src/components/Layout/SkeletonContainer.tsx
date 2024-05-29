import React from "react";

export default function SkeletonContainer(props: React.HTMLAttributes<HTMLDivElement>) {
    const { className, ...rest } = props
    return <div {...rest} className={`${className} overflow-hidden after:flex after:content-[''] after:w-full after:h-full after:animate-skeleton-fade`}>
    </div>
}