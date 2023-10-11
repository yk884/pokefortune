document.addEventListener("DOMContentLoaded", () => {
  const fortuneBtn = document.getElementById("fortuneBtn");
  const pokemonImage = document.getElementById("pokemonImage");
  const pokemonName = document.getElementById("pokemonName");
  const subMessage = document.getElementById("subMessage");

  const clearLocalStorageBtn = document.getElementById("clearLocalStorage");

  // ページ読み込み時に、占い済みかどうか判定
  const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DDの形式で取得
  const fortuneDate = localStorage.getItem("fortuneDate");
  if (fortuneDate === today) {
    fortuneBtn.disabled = true;
    fortuneBtn.innerText = "あした挑戦してね";
  }

  fortuneBtn.addEventListener("click", async () => {
    const overlay = document.getElementById("overlay");
    // アニメーション開始時にz-indexを10に設定
    overlay.style.zIndex = 10;
    // 画面全体を1sかけて真っ黒にフェードアウト
    overlay.style.opacity = 1;

    // 1.5秒待ってから、APIを呼び出し
    setTimeout(async () => {
      const randomId = Math.floor(Math.random() * 721) + 1;
      const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${randomId}/`);
      const data = await res.json();
      //   console.log("Basic Pokemon Data:", data);

      // speciesのエンドポイントから日本語のポケモン名を取得
      const speciesRes = await fetch(data.species.url);
      const speciesData = await speciesRes.json();
      //   console.log("Species Data:", speciesData);

      const japNameObj = speciesData.names.find(
        (name) =>
          name.language.name === "ja-Hrkt" || name.language.name === "ja"
      );

      if (japNameObj) {
        // console.log("Japanese Name Found:", japNameObj.name);
      } else {
        // console.error("Japanese Name Not Found. Using default name.");
      }

      const japName = japNameObj ? japNameObj.name : data.name; // 日本語名が存在しない場合はデフォルトの名前を使用
      //   console.log(japName);
      // 新しい画像のURLをセット
      pokemonImage.src = data.sprites.front_default;
      // 日本語の名前をセット
      pokemonName.textContent = japName;
      //   console.log(pokemonName);
      //   console.log(pokemonName.textContent);

      // 画像の読み込みが完了したら処理を進める
      pokemonImage.onload = () => {
        // モンスター名をセット
        pokemonName.textContent = japName;
        subMessage.style.opacity = 1;
        // モンスター画像に対して、filter: invert(100%)を付与
        pokemonImage.classList.add("inverted");

        // 0.5秒待ってから、モンスター画像のopacityを0に
        setTimeout(() => {
          pokemonImage.style.opacity = 0;

          // さらに1秒後、画面全体の黒色をtransparentにし、モンスター画像のopacityを1に
          setTimeout(() => {
            // モンスター画像のfilterをクリア
            pokemonImage.classList.remove("inverted");
            overlay.style.opacity = 0;
            pokemonImage.style.opacity = 1;

            setTimeout(() => {
              // アニメーション終了後にz-indexを-1に設定
              overlay.style.zIndex = -1;
            }, 1000);
          }, 1000);
        }, 500);
      };
      fortuneBtn.innerText = "あした挑戦してね";
    }, 1500);

    localStorage.setItem("fortuneDate", today);
    fortuneBtn.disabled = true;
  });

  // デバッグ用機能：localStorageをクリア
  clearLocalStorageBtn.addEventListener("click", () => {
    localStorage.removeItem("fortuneDate");
    fortuneBtn.disabled = false;
    fortuneBtn.innerText = "うらなう";
  });
});
