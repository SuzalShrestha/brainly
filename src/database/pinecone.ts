// import { Pinecone } from '@pinecone-database/pinecone';

// export const pc = new Pinecone({
//     apiKey: process.env.PINECONE_API_KEY!,
// });

// const indexName = 'quickstart';
// export const index = async () => {
//     await pc.createIndex({
//         name: indexName,
//         dimension: 1024, // Replace with your model dimensions
//         metric: 'cosine', // Replace with your model metric
//         spec: {
//             serverless: {
//                 cloud: 'aws',
//                 region: 'us-east-1',
//             },
//         },
//     });
// };
// const model = 'multilingual-e5-large';

// const data = [
//     {
//         id: 'vec1',
//         text: 'Apple is a popular fruit known for its sweetness and crisp texture.',
//     },
//     {
//         id: 'vec2',
//         text: 'The tech company Apple is known for its innovative products like the iPhone.',
//     },
//     { id: 'vec3', text: 'Many people enjoy eating apples as a healthy snack.' },
//     {
//         id: 'vec4',
//         text: 'Apple Inc. has revolutionized the tech industry with its sleek designs and user-friendly interfaces.',
//     },
//     {
//         id: 'vec5',
//         text: 'An apple a day keeps the doctor away, as the saying goes.',
//     },
//     {
//         id: 'vec6',
//         text: 'Apple Computer Company was founded on April 1, 1976, by Steve Jobs, Steve Wozniak, and Ronald Wayne as a partnership.',
//     },
// ];

// const callembeddings = async () => {
//     const embeddings = await pc.inference.embed(
//         model,
//         data.map((d) => d.text),
//         { inputType: 'passage', truncate: 'END' }
//     );
//     const index = pc.index(indexName);

//     const vectors = data.map((d, i) => ({
//         id: d.id,
//         values: embeddings[i].values,
//         metadata: { text: d.text },
//     }));

//     await index.namespace('ns1').upsert(vectors);
// };
// //index(); //call index only once
// callembeddings();
