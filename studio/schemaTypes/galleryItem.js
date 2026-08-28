import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'galleryItem',
  title: 'Gallery Project',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Project Title',
      type: 'string',
      description: 'e.g. Dock Installation, Boat Lift Installation, Marine Salvage',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'location',
      title: 'Location',
      type: 'string',
      description: 'e.g. Torch Lake, MI or Grand Traverse Bay, MI',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'category',
      title: 'Service Icon / Category',
      type: 'string',
      options: {
        list: [
          { title: '🏠 Dock Installation', value: 'dock-installation' },
          { title: '⚓ Boat Lift Installation', value: 'boat-lift-installation' },
          { title: '🛟 Marine Salvage', value: 'marine-salvage' },
          { title: '🔧 Dock & Lift Repair', value: 'dock-repair' },
          { title: '🤿 Marine Diving Services', value: 'dive-services' },
          { title: '🔨 Dock Construction', value: 'dock-construction' },
          { title: '🚛 Barge & Transport', value: 'barge-transport' },
          { title: '🆘 Emergency Vessel Recovery', value: 'emergency-recovery' },
        ],
        layout: 'radio',
      },
      initialValue: 'dock-installation',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'image',
      title: 'Project Photo',
      type: 'image',
      description: 'Upload high-resolution photo for the gallery & lightbox',
      options: {
        hotspot: true,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'order',
      title: 'Display Order',
      type: 'number',
      description: 'Optional sort order number (1 = first, 2 = second, etc.)',
      initialValue: 10,
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'location',
      media: 'image',
    },
  },
  orderings: [
    {
      title: 'Display Order',
      name: 'orderAsc',
      by: [{field: 'order', direction: 'asc'}, {field: '_createdAt', direction: 'desc'}],
    },
  ],
})
