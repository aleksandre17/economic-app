# 🔌 API Integration Guide

Backend integration guide for the Classifiers System.

---

## 📋 Overview

This guide helps backend developers understand how to provide classifier data to the frontend system.

---

## 🎯 Expected API Response Format

### Standard Format

All classifier endpoints should return an array of objects:

```json
[
  {
    "id": 1,
    "name": "Category Name",
    "code": "CAT001",
    "parentId": null,
    "isActive": true
  },
  {
    "id": 2,
    "name": "Subcategory",
    "code": "CAT002",
    "parentId": 1,
    "isActive": true
  }
]
```

### Required Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | number/string | ✅ Yes | Unique identifier |
| `name` | string | ✅ Yes | Display name |
| `code` | string | ❌ No | Short code/abbreviation |
| `parentId` | number/string | ❌ No | For hierarchical data |
| `isActive` | boolean | ❌ No | Active/inactive flag |
| `metadata` | object | ❌ No | Additional data |

---

## 📡 Endpoint Requirements

### 1. Categories Endpoint

**URL:** `GET /api/classifiers/categories`

**Response:**
```json
[
  {
    "id": 1,
    "name": "IT & Technology",
    "code": "IT",
    "isActive": true
  },
  {
    "id": 2,
    "name": "Human Resources",
    "code": "HR",
    "isActive": true
  }
]
```

---

### 2. Positions Endpoint

**URL:** `GET /api/classifiers/positions`

**Response:**
```json
[
  {
    "id": 1,
    "name": "Software Developer",
    "code": "DEV",
    "isActive": true
  },
  {
    "id": 2,
    "name": "Project Manager",
    "code": "PM",
    "isActive": true
  }
]
```

---

### 3. Departments Endpoint

**URL:** `GET /api/classifiers/departments`

**Response:**
```json
[
  {
    "id": 1,
    "name": "Engineering",
    "code": "ENG",
    "isActive": true
  },
  {
    "id": 2,
    "name": "Sales",
    "code": "SALES",
    "isActive": true
  }
]
```

---

### 4. Hierarchical Data (Regions/Cities)

**URL:** `GET /api/classifiers/regions`

**Response:**
```json
[
  {
    "id": 1,
    "name": "Tbilisi",
    "code": "TBS",
    "parentId": null,
    "isActive": true
  },
  {
    "id": 2,
    "name": "Vake",
    "code": "VKE",
    "parentId": 1,
    "isActive": true
  },
  {
    "id": 3,
    "name": "Saburtalo",
    "code": "SBT",
    "parentId": 1,
    "isActive": true
  }
]
```

---

## 🔧 Custom Response Format

If your API returns a different format, use a transformer:

### Example 1: Wrapped Response

**API Response:**
```json
{
  "success": true,
  "data": [
    { "category_id": 1, "category_name": "IT" }
  ],
  "meta": {
    "total": 1
  }
}
```

**Frontend Transformer:**
```typescript
{
  [CLASSIFIER_KEYS.CATEGORIES]: {
    endpoint: '/api/classifiers/categories',
    transform: (response) => {
      return response.data.map(item => ({
        id: item.category_id,
        name: item.category_name,
      }));
    },
  },
}
```

---

### Example 2: Different Field Names

**API Response:**
```json
[
  { "pk": 1, "title": "Category 1", "slug": "cat-1" }
]
```

**Frontend Transformer:**
```typescript
{
  [CLASSIFIER_KEYS.CATEGORIES]: {
    endpoint: '/api/classifiers/categories',
    transform: (response) => {
      return response.map(item => ({
        id: item.pk,
        name: item.title,
        code: item.slug,
      }));
    },
  },
}
```

---

## 🔒 Authentication

### Option 1: Global Headers

```typescript
// api/apiClient.ts
export class ApiClient {
  async get<T>(endpoint: string): Promise<T> {
    const token = localStorage.getItem('authToken');
    
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    return await response.json();
  }
}
```

---

### Option 2: Per-Request Auth

```typescript
{
  [CLASSIFIER_KEYS.CATEGORIES]: {
    endpoint: '/api/classifiers/categories',
    headers: {
      'Authorization': 'Bearer YOUR_TOKEN',
    },
  },
}
```

---

## 📊 Caching Headers

Backend can help with caching:

```http
GET /api/classifiers/categories

Response Headers:
Cache-Control: public, max-age=86400
ETag: "33a64df551425fcc55e4d42a148795d9f25f89d4"
Last-Modified: Wed, 08 Dec 2024 12:00:00 GMT
```

Frontend will respect these headers.

---

## 🚀 Performance Optimization

### 1. Pagination (Optional)

For large datasets:

```http
GET /api/classifiers/categories?page=1&limit=100
```

```json
{
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 100,
    "total": 500
  }
}
```

---

### 2. Filtering (Optional)

```http
GET /api/classifiers/categories?active=true
GET /api/classifiers/positions?department_id=5
```

---

### 3. Compression

Enable gzip compression:

```http
Response Headers:
Content-Encoding: gzip
```

---

## 🐛 Error Handling

### Standard Error Format

```json
{
  "error": {
    "code": "CLASSIFIER_NOT_FOUND",
    "message": "Classifier not found",
    "details": {}
  }
}
```

### HTTP Status Codes

| Code | Meaning | Frontend Action |
|------|---------|-----------------|
| 200 | Success | Cache and use data |
| 304 | Not Modified | Use cached data |
| 400 | Bad Request | Show error |
| 401 | Unauthorized | Redirect to login |
| 404 | Not Found | Show error |
| 500 | Server Error | Retry with backoff |
| 503 | Service Unavailable | Retry later |

---

## 🧪 Testing Endpoints

### Test Checklist

```bash
# 1. Check response format
curl -X GET "http://localhost:3000/api/classifiers/categories" \
  -H "Accept: application/json"

# 2. Check CORS headers
curl -X OPTIONS "http://localhost:3000/api/classifiers/categories" \
  -H "Origin: http://localhost:5173"

# 3. Check performance
curl -w "Time: %{time_total}s\n" \
  "http://localhost:3000/api/classifiers/categories"

# 4. Check compression
curl -H "Accept-Encoding: gzip" \
  "http://localhost:3000/api/classifiers/categories" \
  --compressed
```

---

## 📋 Implementation Examples

### Node.js/Express

```javascript
// routes/classifiers.js
const express = require('express');
const router = express.Router();

// GET /api/classifiers/categories
router.get('/categories', async (req, res) => {
  try {
    const categories = await db.query('SELECT id, name, code FROM categories WHERE is_active = true');
    
    res.set('Cache-Control', 'public, max-age=86400'); // 24 hours
    res.json(categories);
  } catch (error) {
    res.status(500).json({
      error: {
        code: 'INTERNAL_ERROR',
        message: error.message,
      },
    });
  }
});

module.exports = router;
```

---

### Python/Django

```python
# views.py
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Category
from .serializers import CategorySerializer

@api_view(['GET'])
def categories(request):
    categories = Category.objects.filter(is_active=True)
    serializer = CategorySerializer(categories, many=True)
    
    response = Response(serializer.data)
    response['Cache-Control'] = 'public, max-age=86400'
    
    return response
```

```python
# serializers.py
from rest_framework import serializers

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name', 'code', 'parent_id', 'is_active']
```

---

### PHP/Laravel

```php
// routes/api.php
Route::get('/classifiers/categories', function () {
    $categories = Category::where('is_active', true)->get();
    
    return response()->json($categories)
        ->header('Cache-Control', 'public, max-age=86400');
});
```

```php
// Models/Category.php
class Category extends Model
{
    protected $fillable = ['id', 'name', 'code', 'parent_id', 'is_active'];
    
    protected $hidden = ['created_at', 'updated_at'];
    
    protected $casts = [
        'is_active' => 'boolean',
    ];
}
```

---

### Java/Spring Boot

```java
// ClassifierController.java
@RestController
@RequestMapping("/api/classifiers")
public class ClassifierController {
    
    @GetMapping("/categories")
    @Cacheable(value = "categories", cacheManager = "cacheManager")
    public ResponseEntity<List<Category>> getCategories() {
        List<Category> categories = categoryRepository.findByIsActiveTrue();
        
        return ResponseEntity
            .ok()
            .cacheControl(CacheControl.maxAge(24, TimeUnit.HOURS).cachePublic())
            .body(categories);
    }
}
```

---

## 🔍 Monitoring

### Metrics to Track

1. **Response Time**: < 200ms recommended
2. **Cache Hit Rate**: > 80% ideal
3. **Error Rate**: < 1%
4. **Data Size**: < 100KB per classifier

### Logging

```javascript
// Backend logging
logger.info({
  endpoint: '/api/classifiers/categories',
  responseTime: '150ms',
  itemCount: 25,
  cacheHit: true,
});
```

---

## 🎯 Best Practices

### ✅ DO

- Return consistent JSON format
- Include appropriate cache headers
- Compress large responses
- Return only active items by default
- Use HTTP status codes correctly
- Handle errors gracefully

### ❌ DON'T

- Return inconsistent field names
- Include sensitive data
- Return huge payloads (> 1MB)
- Ignore cache headers
- Return HTML errors

---

## 📞 Frontend Integration

Once backend is ready:

```typescript
// Frontend configuration
export const CLASSIFIER_CONFIGS = {
  [CLASSIFIER_KEYS.CATEGORIES]: {
    key: CLASSIFIER_KEYS.CATEGORIES,
    endpoint: '/api/classifiers/categories', // Your endpoint
    ttl: 24 * 60 * 60 * 1000,
    version: '1.0.0',
  },
};
```

---

## 🧪 Testing Integration

```bash
# Test from frontend
npm run dev

# Open browser console
# Should see:
# 🚀 ClassifierProvider: Starting prefetch
# 🌐 Fetching classifier: categories
# ✅ Fetched classifier: categories (25 items)
# 💾 Saved classifier: categories
```

---

## 📚 Additional Resources

- [REST API Best Practices](https://restfulapi.net/)
- [HTTP Caching Guide](https://developer.mozilla.org/en-US/docs/Web/HTTP/Caching)
- [JSON:API Specification](https://jsonapi.org/)

---

**Questions?** Contact frontend team or open an issue.
