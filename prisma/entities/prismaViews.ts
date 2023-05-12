
export type View = {
    type:       string
    columns:    string[]
}

export type Table = {
    table_name:     string
    column_name:    string
    is_nullable:    boolean
    data_type:      string
}

const getType = (p:string) => {
  switch (p) {
    case 'USER-DEFINED':
      return 'any // enum'
    
    case 'json':
      return '{}'
  
    case 'int':
    case 'bigint':
    case 'integer':
      return 'number'

    case 'timestamp without time zone':
      return 'string // timestamp'

    case 'text':
      return 'string'
    
    default:
      return p
  }
}

export const getViews = async (): Promise<View[]> => {
    const rows:Table[] = await prisma.$queryRaw`
        SELECT table_name, column_name, is_nullable, data_type
        FROM information_schema.columns
        WHERE table_schema = 'public' and table_name LIKE 'v_%'
        order by table_name
    `
  
    const views: Record<string, View> = {}
  
    rows.forEach(row => {
      const type = row.table_name
  
      if (!views[type]) {
        views[type] = {
          type,
          columns: [],
        }
      }
  
      views[type].columns.push(`${row.column_name}: ${getType(row.data_type)}`)
    })
  
    return Object.values(views)
}

export const PrismaViews = { getViews}
