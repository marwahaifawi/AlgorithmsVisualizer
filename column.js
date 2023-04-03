class Column {
  constructor(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }

  draw(ctx, color) {
    ctx.fillStyle = color || "#acd6e6";
    ctx.fillRect(
      this.x - this.width / 2,
      this.y - this.height,
      this.width,
      this.height
    );
    ctx.fillStyle = "#fff";
    ctx.font = "18px 'Edu NSW ACT Foundation', cursive";
    ctx.fillText(
      this.height.toString(),
      this.x - this.width / 2 + 5,
      this.y - this.height - 10
    );
  }
}
