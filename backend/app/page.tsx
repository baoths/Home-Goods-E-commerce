'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { productsApi, authApi, type Product } from '@/lib/api'

export default function ApiHomePage() {
  const apiEndpoints = [
    // Products
    { method: 'GET', path: '/api/products', description: 'Fetch all products' },
    { method: 'POST', path: '/api/products', description: 'Create a new product (Admin required)' },
    { method: 'GET', path: '/api/products/{id}', description: 'Fetch a single product by ID' },
    { method: 'PUT', path: '/api/products/{id}', description: 'Update a product by ID (Admin required)' },
    { method: 'DELETE', path: '/api/products/{id}', description: 'Delete a product by ID (Admin required)' },
    { method: 'GET', path: '/api/products/category/{categoryId}', description: 'Fetch products by category ID' },
    
    // Categories
    { method: 'GET', path: '/api/categories', description: 'Fetch all categories' },
    { method: 'POST', path: '/api/categories', description: 'Create a new category (Admin required)' },
    { method: 'GET', path: '/api/categories/{id}', description: 'Fetch a single category by ID' },
    { method: 'PUT', path: '/api/categories/{id}', description: 'Update a category by ID (Admin required)' },
    { method: 'DELETE', path: '/api/categories/{id}', description: 'Delete a category by ID (Admin required)' },
    
    // Banners
    { method: 'GET', path: '/api/banners', description: 'Fetch all banners' },
    { method: 'POST', path: '/api/banners', description: 'Create a new banner (Admin required)' },
    { method: 'GET', path: '/api/banners/{id}', description: 'Fetch a single banner by ID' },
    { method: 'PUT', path: '/api/banners/{id}', description: 'Update a banner by ID (Admin required)' },
    { method: 'DELETE', path: '/api/banners/{id}', description: 'Delete a banner by ID (Admin required)' },
    
    // Auth
    { method: 'POST', path: '/api/auth/register', description: 'Register a new user' },
    { method: 'POST', path: '/api/auth/login', description: 'Login a user' },
    { method: 'GET', path: '/api/auth/me', description: 'Get current user profile (Auth required)' },
    { method: 'PUT', path: '/api/auth/update-profile', description: 'Update current user profile (Auth required)' },
    
    // Users (Admin)
    { method: 'GET', path: '/api/users', description: 'Fetch all users (Admin required)' },
    { method: 'GET', path: '/api/users/{id}', description: 'Fetch a single user by ID (Admin required)' },
    { method: 'PUT', path: '/api/users/{id}', description: 'Update a user by ID (Admin required)' },
    { method: 'DELETE', path: '/api/users/{id}', description: 'Delete a user by ID (Admin required)' },
    
    // Admin
    { method: 'GET', path: '/api/admin/statistics', description: 'Get store statistics (Admin required)' },
  ];

  return (
    <div className="container mx-auto p-8 font-sans">
      <header className="mb-10 text-center">
        <h1 className="text-5xl font-bold text-gray-800">Home Goods API</h1>
        <p className="text-lg text-gray-600 mt-2">A list of available API endpoints.</p>
      </header>
      <main>
        <div className="overflow-x-auto bg-white rounded-lg shadow">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Method
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Path
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Description
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {apiEndpoints.map((endpoint, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      endpoint.method === 'GET' ? 'bg-green-100 text-green-800' :
                      endpoint.method === 'POST' ? 'bg-blue-100 text-blue-800' :
                      endpoint.method === 'PUT' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {endpoint.method}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-mono">{endpoint.path}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{endpoint.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
      <footer className="text-center mt-10 text-gray-500">
        <p>Backend service is running.</p>
      </footer>
    </div>
  );
}
