import { BookOpen, Map, Users, Shield, Star, Gamepad2 } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

export interface NavigationItem {
	key: string // 用于翻译键，如 'guide' -> t('nav.guide')
	path: string // URL 路径，如 '/guide'
	icon: LucideIcon // Lucide 图标组件
	isContentType: boolean // 是否对应 content/ 目录
}

export const NAVIGATION_CONFIG: NavigationItem[] = [
	{ key: 'guide', path: '/guide', icon: BookOpen, isContentType: true },
	{ key: 'walkthrough', path: '/walkthrough', icon: Map, isContentType: true },
	{ key: 'visitors', path: '/visitors', icon: Users, isContentType: true },
	{ key: 'survival', path: '/survival', icon: Shield, isContentType: true },
	{ key: 'endings', path: '/endings', icon: Star, isContentType: true },
	{ key: 'mechanics', path: '/mechanics', icon: Gamepad2, isContentType: true },
]

// 从配置派生内容类型列表（用于路由和内容加载）
export const CONTENT_TYPES = NAVIGATION_CONFIG.filter((item) => item.isContentType).map(
	(item) => item.path.slice(1),
) // 移除开头的 '/' -> ['guide', 'walkthrough', 'visitors', 'survival', 'endings', 'mechanics']

export type ContentType = (typeof CONTENT_TYPES)[number]

// 辅助函数：验证内容类型
export function isValidContentType(type: string): type is ContentType {
	return CONTENT_TYPES.includes(type as ContentType)
}
