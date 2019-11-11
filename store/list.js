import s3Client, {endpoint, bucket} from '../plugins/s3Client';
import {icon, extensions} from '../utils/icon';

/*
 * rootPath: indexルートのパス状態管理はしていないからsteteに定義するのはおかしいかもしれない)
 * path: 現在のパス
 * contents: {
 *  files: [ // ファイル群
 *   {
 *     key: キー String
 *     name: ビューに表示する名前
 *     icon: {
 *       param: アイコン
 *       option: アイコンのclassに指定するoption
 *     },
 *     timestamp: タイムスタンプ String
 *   }
 *  ] ,
 *  dirs: [ // ディレクトリ群
 *   {
 *     key: キー String
 *     name: ビューに表示する名前
 *     icon: {
 *       param: アイコン
 *       option: アイコンのclassに指定するoption
 *     },
 *     timestamp: タイムスタンプ String
 *   }
 *  ] ,
 * }
 */
export const state = () => ({
  rootPath: `${endpoint}${bucket}`,
  path: '',
  contents: {}
});

export const getters = {
  rootPath: (state) => state.rootPath,
  path: (state) => state.path,
  contents: (state) => state.contents
};

export const mutations = {
  updateContents (state, contents) {
    state.contents = contents;
  },

  updatePath (state, path) {
    state.path = path;
  }
};

export const actions = {
  updatePath ({commit}, path = '') {
    const mPath = path ? `${path}/` : path;
    commit('updatePath', mPath);
  },

  async getList ({commit, state}) {
    const path = state.path;

    const param = {
      Bucket: bucket,
      Prefix: path,
      Delimiter: '/'
    };
    const contents = await callS3Api.listObjects(s3Client, param, path);
    commit('updateContents', contents);
  }
};

// TODO: ここら辺の関数は違うファイルの切り出すべきかもしれない
const callS3Api = {
  /**
   * クエリに入ってきたパスに応じたファイルのリストを返す
   * @param client s3のインスタンス
   * @param param listObjectsを呼び出す際に必要なパラメータ
   * @param path 相対パス
   * @returns {Promise.<{files: Array, dirs: Array}>}
   */
  async listObjects (client, param, path) {
    try {
      const res = await client.listObjects(param).promise();
      // ファイルとディレクトリを格納する配列
      let contents = {files: [], dirs: []};

      res.Contents.forEach(cnt=> {
        if (String(cnt.Key).slice(-1) === '/') {
          return;
        }

        const obj = {
          key: String(cnt.Key),
          name: common.modifyFileKey(cnt.Key, path),
          timestamp: common.modifyTimeStamp(cnt.LastModified),
          icon: common.createIcon(cnt.Key)
        };
        contents['files'].push(obj);
      });

      res.CommonPrefixes.forEach(cmp=> {
        const obj = {
          key: String(cmp.Prefix).replace(/(.*)\//, '$1'),
          name: common.modifyDirkey(cmp.Prefix, path),
          timestamp: '',
          icon: {
            param: icon.dir.param,
            option: icon.dir.option
          }
        };
        contents['dirs'].push(obj);
      });

      // TODO: 1回で1000件までしか取ってこれないので、再帰的に呼び出す必要がある

      return contents;

    } catch (err) {
      console.log('S3 listObjects error:', err);
    }
  }
};

const common = {
  /**
   * ビューに表示するディレクトリ名を返す
   * @param dirKey 取得したディレクトリのキー
   * @param path 相対パス
   * @returns {string}
   */
  modifyDirkey (dirKey, path) {
    let mDirKey = String(dirKey);
    if (path) {
      mDirKey = mDirKey.replace(path, '');
    }

    return mDirKey.replace(/(.*)\//, '$1');
  },

  /**
   * ビューに表示するファイル名を返す
   * @param fileKey 取得したファイルのキー
   * @param path 相対パス
   * @returns {string}
   */
  modifyFileKey (fileKey, path) {
    let mFileKey = String(fileKey);
    if (path) {
      mFileKey = mFileKey.replace(path, '');
    }
    return mFileKey;
  },

  /**
   * ビューに表示するタイムスタンプを返す
   * @param timestamp 取得したタイムスタンプ
   * @returns {string}
   */
  modifyTimeStamp (timestamp) {
    const separator = String(timestamp).split(' ');
    return separator.slice(0, 5).join(' ');
  },

  /**
   * ビューに表示するファイルのアイコンのオブジェクトを返す
   * @param key 取得したファイルのキー
   * @returns {*}
   */
  createIcon (key) {
    const separator = String(key).split('.');
    const ext = separator[separator.length - 1];
    for (const key of Object.keys(extensions)) {
      if (extensions[key].some(extension => String(extension).toUpperCase() === String(ext).toUpperCase())) {
        const obj = {
          param: icon[key].param,
          option: icon[key].option
        };
        return obj;
      }
    }
    const obj = {
      param: icon.file.param,
      option: icon.file.option
    };
    return obj;
  }
};
