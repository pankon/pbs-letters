import 'phaser';
import particleUrl from '../assets/policeman.jpeg';
import badGuyUrl from '../assets/bad_guy.jpeg';
import gaspUrl from '../assets/gasp.mp3';
import jailUrl from '../assets/jail.png';
import generator from 'generate-maze';

// @ts-nocheck

export const menuSceneKey = 'MenuScene';

export function menu(): Phaser.Types.Scenes.SettingsConfig | Phaser.Types.Scenes.CreateSceneFromObjectConfig {
  let startKey: Phaser.Input.Keyboard.Key;
  let sprite: Phaser.GameObjects.Image;
  let targets: { s: Phaser.GameObjects.Text }[];
  let jail: Phaser.GameObjects.Image;
  let badGuy: Phaser.GameObjects.Image;

  return {
    key: menuSceneKey,
    preload() {
      targets = [];
      startKey = this.input.keyboard.addKey(
        Phaser.Input.Keyboard.KeyCodes.S,
      );
      startKey.isDown = false;
      this.load.image('particle', particleUrl);
      this.load.image('badGuy', badGuyUrl);
      this.load.image('jail', jailUrl);
      this.load.audio('gasp', gaspUrl);
    },
    create() {
      this.add.text(0, 0, 'Press S to restart scene', {
        fontSize: '60px',
        fontFamily: "Helvetica",
      });
      badGuy = this.add.image(300, 100, 'badGuy');
      jail = this.add.image(399, 500, 'jail');

      sprite = this.add.image(100, 100, 'particle');
      sprite.setInteractive({draggable:true});
      sprite.on('drag', (pointer, dragX, dragY) => sprite.setPosition(dragX, dragY));

      const offset = 0.5;
      const letters = 'ABCDEFGHIJKLMOPQRSTUVWXYZ';
      const number = 100;
      // const maze = generator(number);
      // for (let x = 0; x < number; x++) {
      //   for (let y = 0; y < 4; y++) {
      //     const pos =maze[y][x];
      //     let image = this.add.text(pos.x * 100, pos.y * 100, letters[(x + (y * number)) % letters.length], { fontSize: '32px' });
      //     if (pos.top) {
      //       this.add.text((pos.x) * 100, (pos.y - offset) * 100, letters[(x + (y * number) + 1) % letters.length], { fontSize: '32px' });
      //     }

      //     if (pos.left) {
      //       this.add.text((pos.x - offset) * 100, (pos.y) * 100, letters[(x + (y * number) + 2) % letters.length], { fontSize: '32px' });
      //     }

      //     if (pos.bottom) {
      //       this.add.text((pos.x) * 100, (pos.y + offset) * 100, letters[(x + (y * number) + 3) % letters.length], { fontSize: '32px' });
      //     }

      //     if (pos.right) {
      //       this.add.text((pos.x + offset) * 100, (pos.y) * 100, letters[(x + (y * number) + 4) % letters.length], { fontSize: '32px' });
      //     }

      //     // image.setBlendMode(Phaser.BlendModes.ADD);
      //     // sprites.push({ s: image, r: 2 + Math.random() * 6 });
      //   }
      // }

      for (let i = 0; i < 100; i++) {
        const x = Phaser.Math.Between(30, 800 - 30);
        const y = Phaser.Math.Between(30, 600 - 30);

        let text = this.add.text(x, y, letters[i % letters.length], { fontSize: '32px' });
        targets.push({ s: text })
        // sprites.push({ s: sprite, r: 2 + Math.random() });
      }
    },
    update() {
      if (startKey.isDown) {
        this.sound.play('gasp');
        this.scene.start(menuSceneKey);
      }

      let offsetX = 0;
      let offsetY = 0;
      let cursors = this.input.keyboard.createCursorKeys();
      if (cursors.left.isDown) {
        offsetX = -10;
      } else if (cursors.right.isDown) {
        offsetX = 10;
      } else if (cursors.up.isDown) {
        offsetY = -10;
      } else if (cursors.down.isDown) {
        offsetY = 10;
      }


      sprite.y += offsetY; // sprites[i].r;
      sprite.x += offsetX; // sprites[i].r;

      if (targets.length == 0) {
        // this.sound.play('gasp');
        this.add.text(300, 300, 'BAD GUY TO JAIL!!', {
          fontSize: '60px',
          fontFamily: "Helvetica",
        });

        jail.setY(300);
        jail.setX(300);

        badGuy.setX(jail.x);
        badGuy.setY(jail.y);
        // this.scene.start(menuSceneKey);
      }

      const range = 50;
      for (let j = 0; j < targets.length; j++) {
        let target = targets[j];
        let bottomLeft = target.s.getBottomLeft();
        let topRight = target.s.getTopRight();
        if (
          bottomLeft.x >= (sprite.x - range)
          && topRight.x <= (sprite.x + range)
          && bottomLeft.y >= (sprite.y - range)
          && topRight.y <= (sprite.y + range)) {
          // target.s.setPosition(1000,1000);
          target.s.setText('👮‍♂️​');
          targets.splice(j, 1);
          break;
        }
      }

      if (sprite.y < -256) {
        sprite.y = 700;
      }

      if (sprite.y > 800) {
        sprite.y = 0;
      }

      if (sprite.x < -256) {
        sprite.x = 700;
      }

      if (sprite.x > 800) {
        sprite.x = 0;
      }
    },
  }
}