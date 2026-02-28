import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchAdmins, authSelector } from '@/features/admin/auth-slice'

function AdminDashboard() {
  const dispatch = useDispatch()
  const { admins } = useSelector(authSelector)

  useEffect(() => {
    dispatch(fetchAdmins())
  }, [dispatch])

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Admin Users</h2>
      {admins && admins.length > 0 ? (
        <ul className="space-y-2">
          {admins.map((a) => (
            <li key={a._id} className="p-2 border rounded flex items-center gap-3">
              <img src={a.profileImage} alt={a.name} className="w-10 h-10 rounded-full object-cover" />
              <div>
                <div className="font-medium">{a.name}</div>
                <div className="text-sm text-gray-500">{a.email}</div>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p>No admin users found.</p>
      )}
    </div>
  )
}

export default AdminDashboard