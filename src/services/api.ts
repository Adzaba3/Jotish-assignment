import { Employee } from '../types/employee'

const ENDPOINT = 'https://backend.jotish.in/backend_dev/gettabledata.php'

type ApiEmployee = {
  id?: string | number
  name?: string
  email?: string
  city?: string
  salary?: string | number
}

type ApiResponse = {
  TABLE_DATA?: {
    data?: unknown[]
  }
}

const toEmail = (name: string) => {
  const safe = name.toLowerCase().replace(/[^a-z0-9]+/g, '.').replace(/\.+/g, '.')
  return `${safe}@example.com`
}

const parseSalary = (value: string | number | undefined) => {
  if (typeof value === 'number') return value
  if (!value) return 0
  const numeric = value.replace(/[^0-9.]/g, '')
  return Number(numeric || 0)
}

const mapEmployeeObject = (row: ApiEmployee, index: number): Employee => {
  const id = row.id ?? `${index + 1}`
  return {
    id: String(id),
    name: row.name ?? 'Unknown',
    email: row.email ?? toEmail(row.name ?? 'unknown'),
    city: row.city ?? 'Unknown',
    salary: parseSalary(row.salary),
  }
}

export const fetchEmployees = async (signal?: AbortSignal): Promise<Employee[]> => {
  const response = await fetch(ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username: 'test', password: '123456' }),
    signal,
  })

  if (!response.ok) {
    throw new Error(`API error: ${response.status}`)
  }

  const data = (await response.json()) as ApiEmployee[] | ApiResponse
  if (Array.isArray(data)) {
    return data.map(mapEmployeeObject)
  }

  const rows = data?.TABLE_DATA?.data
  if (!Array.isArray(rows)) return []

  return rows.map((row, index) => {
    if (Array.isArray(row)) {
      const [name, _role, city, id, _startDate, salary] = row as Array<string>
      return mapEmployeeObject(
        { id, name, city, salary, email: toEmail(name ?? 'unknown') },
        index
      )
    }
    return mapEmployeeObject(row as ApiEmployee, index)
  })
}
