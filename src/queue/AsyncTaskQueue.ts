

class AsyncTaskQueue {
    private maxConcurrentRequests: number;
    private queue: Queue<() => void>;
    private currentRequests: number;
    private pendingRequests: number;

    constructor(maxConcurrentRequests: number) {
        this.maxConcurrentRequests = maxConcurrentRequests; // 最大并发数 qps
        this.queue = new Queue(); // 用于存储排队的请求
        this.currentRequests = 0; // 当前正在进行的请求数
        this.pendingRequests = 0; // 等待中的请求数
    }
    
    // 执行请求的函数
    async enqueue(requestFn: (args: { currentRequests: number, pendingRequests: number }) => Promise<void>) {
        // 如果当前请求数达到最大并发数，排队等待
        if (this.currentRequests >= this.maxConcurrentRequests) {
            // 增加排队请求计数
            this.pendingRequests++;
            console.log('达到并发限制，生产者等待');
            await new Promise(resolve => {
                this.queue.enqueue(resolve); // 将resolve函数存入队列，等待被唤醒
            });
        }
        // 开始请求
        this.currentRequests++;
        try {
            await requestFn({
              currentRequests: this.currentRequests,
              pendingRequests: this.pendingRequests
            }); // 执行请求
        } catch (error) {
            console.error("请求失败", error);
        } finally {
            // 请求完成，减少当前请求数
            this.currentRequests--;
            // 当所有请求完成时，打印队列为空信息
            if (this.pendingRequests === 0 && this.queue.length() === 0) {
                console.log("队列为空, 等待新的请求");
            }
            // 如果有排队的请求，唤醒下一个
            if (this.queue.length() > 0) {
                const resolve = this.queue.dequeue();
                resolve(); // 唤醒下一个排队的请求
                this.pendingRequests--;
            } 
        }
    }
}

// 测试用例
// 模拟异步请求函数
async function mockRequest(id, currentRequests , pendingRequests) {
  console.log(`\x1b[32m请求 ${id} 开始 , 正在进行的请求${currentRequests} 当前排队长度 ${pendingRequests} \x1b[0m`);  // Green for start (入队)
  await new Promise(resolve => setTimeout(resolve, 1000)); // 模拟请求延迟
  console.log(`\x1b[31m请求 ${id} 完成\x1b[0m`); // Red for complete (出队)
}

// 创建队列实例，最大并发数为 3
const taskQueue = new AsyncTaskQueue(3);

// 模拟 10 个请求
for (let i = 1; i <= 10; i++) {
  taskQueue.enqueue(({currentRequests , pendingRequests}) => mockRequest(i, currentRequests , pendingRequests));  // 添加任务到队列
}
