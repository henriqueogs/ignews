import { GetStaticProps } from "next";

import Head from "next/head";
import Image from "next/image";
import { SubscribeButton } from "../components/SubscribeButton";
import { stripe } from "../services/stripe";

import styles from "./home.module.scss";


// Client-side //de acordo com a utilização do usupario
// Server-side //informação em tempo real do usuário - indexação 
// Static Site Generation //dados gerais da aplicação que não mudam, variam só com um tempo longo 

// Post do blog
    //Conteudo (SSG)
    //Comentários (Client-Side)


interface HomeProps {
  product: {
    priceId: string;
    amount: number;
  };
}

export default function Home({ product }: HomeProps) {
  return (
    <>
      <Head>
        <title> Home | ig.news</title>
      </Head>
      <main className={styles.contentContainer}>
        <section className={styles.hero}>
          <span>👏 Hey welcome!</span>
          <h1>
            News about <br />
            the <span>React</span> world.
          </h1>
          <p>
            Get access to all the publications
            <br />
            <span>for {product.amount} month</span>
          </p>
          <SubscribeButton priceId={product.priceId}/>
        </section>
        <Image src="/avatar.svg" alt="Girl coding" width="336" height="521" />
      </main>
    </>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const price = await stripe.prices.retrieve("price_1JQLkBH2wHTZnpWOrkU4Xi1f");

  const product = {
    priceId: price.id,
    amount: new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price.unit_amount / 100),
  };

  return {
    props: {
      product,
    },
    revalidate: 60 * 60 * 24 //24 hours
  };
};
