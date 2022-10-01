export class ModalStack {
  private _id = 0;
  private _stack: number[] = [];

  public createNew = () => {
    const newId = this._id++;
    this._stack.push(newId);
    return newId;
  };

  public destroy = (id: number) => {
    this._stack = this._stack.filter(i => i !== id);
  };

  public isOnTop = (id: number) => this._stack.length > 0 && this._stack[this._stack.length - 1] === id;

  public someModalIsOpen = () => this._stack.length > 0;
}


export const modalStack = new ModalStack();