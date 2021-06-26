import http from 'k6/http';
import { sleep, check } from 'k6';

export default function() {
  let res = http.get('http://localhost:8080/qa/questions?product_id=324219')
  check(res, {
    'is status 200': (r) => r.status === 200,
    'is response time < 2000ms': (r) => r.timings.duration < 2000
  })
  sleep(1)
}

export default function() {
  let res = http.get('http://localhost:8080/qa/1830317/answers')
  check(res, {
    'is status 200': (r) => r.status === 200,
    'is response time < 2000ms': (r) => r.timings.duration < 2000
  })
  sleep(1)
}

export default function() {
  let res = http.put('http://localhost:8080/qa/questions/12391/helpful')
  check(res, {
    'is status 200': (r) => r.status === 200,
    'is response time < 2000ms': (r) => r.timings.duration < 2000
  })
  sleep(1)
}
