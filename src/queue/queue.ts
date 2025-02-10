class Queue {
    private elements: { [key: number]: any };
    private head: number;
    private tail: number;
    
    constructor() {
      this.elements = {};
      this.head = 0;
      this.tail = 0;
    }
    // 入队
    enqueue(element: any) {
      this.elements[this.tail] = element;
      this.tail++;
    }

    // 出队
    dequeue(callback: (item: any) => void) {
      const item = this.elements[this.head];
      if(callback) callback(item);
      delete this.elements[this.head];
      this.head++;
      return item;
    }

    
    // 队首
    peek() {
      return this.elements[this.head];
    }
    // 队列长度
    length() {
      return this.tail - this.head;
    }
    // 是否为空
    isEmpty() {
      return this.length() === 0;
    }
}

export default Queue;
