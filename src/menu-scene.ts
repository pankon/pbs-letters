import 'phaser';
import particleUrl from '../assets/particle.png';
import gaspUrl from '../assets/gasp.mp3';
import generator from 'generate-maze';

export const menuSceneKey = 'MenuScene';

export function menu(): Phaser.Types.Scenes.SettingsConfig | Phaser.Types.Scenes.CreateSceneFromObjectConfig {
  let startKey: Phaser.Input.Keyboard.Key;
  let sprites: { s: Phaser.GameObjects.Image, r: number }[];

  return {
    key: menuSceneKey,
    preload() {
      sprites = [];
      startKey = this.input.keyboard.addKey(
        Phaser.Input.Keyboard.KeyCodes.S,
      );
      startKey.isDown = false;
      this.load.image('particle', particleUrl);
      this.load.audio('gasp', gaspUrl);
    },
    create() {
      this.add.text(0, 0, 'Press S to restart scene', {
        fontSize: '60px',
        fontFamily: "Helvetica",
      });

      let sprite = this.add.image(100, 100, 'particle');
      sprites.push({ s: sprite, r: 2 + Math.random() * 6 });

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

      for (let i = 0; i < 300; i++) {
        const x = Phaser.Math.Between(-64, 800);
        const y = Phaser.Math.Between(-64, 600);

        let sprite = this.add.text(x, y, letters[i % letters.length], { fontSize: '32px' });

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
        offsetY = 10;
      } else if (cursors.down.isDown) {
        offsetY = -10;
      }

      for (let i = 0; i < sprites.length; i++) {
        const sprite = sprites[i].s;

        sprite.y += offsetY; // sprites[i].r;
        sprite.x += offsetX; // sprites[i].r;

        if (sprite.y < -256) {
          sprite.y = 700;
        }

        if (sprite.y > 700) {
          sprite.y = 0;
        }

        if (sprite.x < -256) {
          sprite.x = 700;
        }

        if (sprite.x > 700) {
          sprite.x = 0;
        }
      }
    },
  }
}