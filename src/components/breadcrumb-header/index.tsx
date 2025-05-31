import React from 'react'
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import type { LucideIcon } from 'lucide-react'

interface Crumb {
  label?: string
  href?: string
  icon?: LucideIcon
}

interface BreadcrumbHeaderProps {
  crumbs: Crumb[]
  title?: string
  className?: string
}

const BreadcrumbHeader: React.FC<BreadcrumbHeaderProps> = ({
  crumbs,
  title,
  className = 'text-lg',
}) => {
  return (
    <div className="mb-6 ">
      <Breadcrumb>
        <BreadcrumbList>
          {crumbs.map((crumb, index) => {
            const Icon = crumb.icon
            return (
              <React.Fragment key={index}>
                <BreadcrumbItem>
                  {crumb.href ? (
                    <BreadcrumbLink href={crumb.href} className="flex items-center gap-1">
                      {Icon && <Icon className="w-4 h-4" />}
                      {crumb.label && <span>{crumb.label}</span>}
                    </BreadcrumbLink>
                  ) : (
                    <BreadcrumbLink
                      href="#"
                      className="flex items-center gap-1 text-foreground font-bold"
                    >
                      {Icon && <Icon className="w-4 h-4" />}
                      {crumb.label && <span>{crumb.label}</span>}
                    </BreadcrumbLink>
                  )}
                </BreadcrumbItem>
                {index < crumbs.length - 1 && <BreadcrumbSeparator />}
              </React.Fragment>
            )
          })}
        </BreadcrumbList>
      </Breadcrumb>
      {/*<h2 className={`${className} font-semibold mt-6`}>{title}</h2>*/}
    </div>
  )
}

export default BreadcrumbHeader
