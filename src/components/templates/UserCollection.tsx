import { useState, useEffect, FC, SyntheticEvent } from 'react';
import {
  collection,
  onSnapshot,
  addDoc,
  serverTimestamp,
  deleteDoc,
  doc,
  updateDoc,
  QueryDocumentSnapshot,
} from 'firebase/firestore';
import { db } from 'Firebase';
import { Link, Outlet } from 'react-router-dom';
import {
  List,
  ListItem,
  Box,
  Text,
  Table,
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Th,
  Td,
  TableCaption,
  TableContainer,
} from '@chakra-ui/react';

import UserCommentCollection from 'components/templates/UserCommentCollection';
import { EmailIcon } from '@chakra-ui/icons';

type FirebaseProps = {
  id: string;
  name: string;
  email: string;
  admin: boolean;
};
const UserCollection: FC = () => {
  const [users, setUsers] = useState<FirebaseProps[]>([]);

  useEffect(() => {
    // usersコレクションを参照する
    const usersCollectionRef = collection(db, 'users');
    // 変更をリアルタイムで検知してusersを変更する
    const unsub = onSnapshot(usersCollectionRef, (querySnapshot) => {
      const datas: Array<QueryDocumentSnapshot> = querySnapshot.docs;
      setUsers(
        datas.map((doc) => ({ ...(doc.data() as FirebaseProps), id: doc.id }))
      );
    });
    return unsub;
  }, []);

  const handleSubmit = async (event: SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();
    const target = event.target as typeof event.target & {
      name: { value: string };
      email: { value: string };
    };

    const usersCollectionRef = collection(db, 'users');
    const documentRef = await addDoc(usersCollectionRef, {
      name: target.name.value,
      email: target.email.value,
      timpstamp: serverTimestamp(),
    });
  };

  const deleteUser = async (id: string) => {
    const userDocumentRef = doc(db, 'users', id);
    await deleteDoc(userDocumentRef);
  };

  const updateUserInfo = async (name: string, email: string, id: string) => {
    const userDocumentRef = doc(db, 'users', id);

    await updateDoc(userDocumentRef, {
      name: name,
      email: email,
    });
  };

  return (
    <Box>
      <TableContainer>
        <Table variant="simple">
          <TableCaption>ユーザー情報</TableCaption>
          <Thead>
            <Tr>
              <Th>ID</Th>
              <Th>名前</Th>
              <Th>メールアドレス</Th>
            </Tr>
          </Thead>
          {users.map((user) => (
            <Tbody key={user.id}>
              <Tr>
                <Td>{user.id}</Td>
                <Td>
                  <Link to={user.id}>{user.name}</Link>
                </Td>
                <Td>{user.email}</Td>
                {user.admin && (
                  <>
                    <Td onClick={() => deleteUser(user.id)}>削除</Td>
                    <Td
                      onClick={() =>
                        updateUserInfo('aaa', 'aaa@aaa.aaa', user.id)
                      }
                    >
                      更新
                    </Td>
                  </>
                )}
              </Tr>
            </Tbody>
          ))}
          <Tfoot>
            <Tr>
              <Th>ID</Th>
              <Th>name</Th>
              <Th>email</Th>
            </Tr>
          </Tfoot>
        </Table>
      </TableContainer>
      <form onSubmit={handleSubmit}>
        <div>
          <label>名前</label>
          <input name="name" type="text" placeholder="名前" />
        </div>
        <div>
          <label>メールアドレス</label>
          <input name="email" type="email" placeholder="メールアドレス" />
        </div>
        <div>
          <button>登録</button>
        </div>
      </form>
      <div>
        {users.map((user) => (
          <Box key={user.id}>
            <UserCommentCollection user_id={user.id} />
          </Box>
        ))}
      </div>
    </Box>
  );
};

export default UserCollection;
