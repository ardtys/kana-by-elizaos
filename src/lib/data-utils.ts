import { getCollection, type CollectionEntry } from 'astro:content'

export async function getAllProjects(): Promise<CollectionEntry<'projects'>[]> {
  const projects = await getCollection('projects')
  return projects.sort((a, b) => {
    const orderA = a.data.order ?? 0
    const orderB = b.data.order ?? 0
    if (orderA !== orderB) {
      return orderA - orderB
    }
    const dateA = a.data.startDate?.getTime() || 0
    const dateB = b.data.startDate?.getTime() || 0
    return dateB - dateA
  })
}

export function groupProjectsByYear(
  projects: CollectionEntry<'projects'>[],
): Record<string, CollectionEntry<'projects'>[]> {
  return projects.reduce(
    (acc: Record<string, CollectionEntry<'projects'>[]>, project) => {
      // Use startDate for grouping, fallback to current year if no date
      const year = project.data.startDate
        ? project.data.startDate.getFullYear().toString()
        : new Date().getFullYear().toString()
      ;(acc[year] ??= []).push(project)
      return acc
    },
    {},
  )
}
